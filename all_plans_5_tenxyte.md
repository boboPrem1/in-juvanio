# Phase 5 — Construction du Skin Studio (Back-Office)
> **Portfolio Builder Engine v3.0** — Plan d'implémentation complet

---

## Vue d'ensemble

Le Skin Studio est une **SPA React séparée** (`apps/studio/`) qui permet au propriétaire d'un portfolio de modifier visuellement son skin et son contenu, de prévisualiser les changements en temps réel, puis de publier en un clic. Contrairement à la v2, il n'y a **plus de génération de fichier JSON** — chaque modification envoie un PATCH à l'API et s'applique immédiatement.

```
apps/studio/
├── src/
│   ├── main.jsx               ← Point d'entrée
│   ├── App.jsx                ← Router + Auth guard
│   ├── store/
│   │   ├── useSkinStore.js    ← Zustand store central
│   │   └── useDataStore.js    ← Zustand store contenu
│   ├── api/
│   │   ├── client.js          ← Axios instance + intercepteurs JWT
│   │   ├── skin.api.js
│   │   ├── data.api.js
│   │   ├── assets.api.js
│   │   └── publish.api.js
│   ├── components/
│   │   ├── layout/
│   │   │   ├── StudioLayout.jsx      ← Shell principal (2 panneaux)
│   │   │   ├── LeftPanel.jsx         ← Editeur (tabbed)
│   │   │   └── RightPanel.jsx        ← Iframe preview + toolbar
│   │   ├── editor/
│   │   │   ├── TokensEditor.jsx      ← Couleurs, typographie, spacing
│   │   │   ├── ArchitectureEditor.jsx ← Drag-and-drop des sections
│   │   │   ├── AddonsEditor.jsx      ← Toggles cursor, noise, etc.
│   │   │   ├── ContentEditor.jsx     ← PATCH data par section/lang
│   │   │   └── AssetsEditor.jsx      ← Upload photo, favicon, CV
│   │   ├── preview/
│   │   │   ├── PreviewFrame.jsx      ← Iframe + postMessage bridge
│   │   │   └── ViewportToolbar.jsx   ← 375 / 768 / 100%
│   │   ├── publish/
│   │   │   ├── PublishButton.jsx     ← Déclenche POST /publish
│   │   │   └── HistoryPanel.jsx      ← Liste + bouton rollback
│   │   └── auth/
│   │       ├── LoginPage.jsx
│   │       └── AuthGuard.jsx
│   └── hooks/
│       ├── useStudioInit.js   ← Charge skin + data au mount
│       ├── useAutoSave.js     ← Debounce PATCH
│       └── useIframeBridge.js ← postMessage vers la preview
```

---

## 5.1 — Authentification : JWT + RBAC

### Flux de connexion

```
POST /api/v1/auth/login  { email, password }
  => { access_token, refresh_token, user: { id, slug, role } }
  => Stockage : access_token en mémoire JS (non localStorage)
               refresh_token en cookie HttpOnly (géré par le serveur)
```

Le `access_token` (durée : 15 min) est stocké dans le **state React / Zustand** uniquement, jamais dans `localStorage` (XSS). Le `refresh_token` (durée : 7 jours) est placé dans un cookie `HttpOnly; Secure; SameSite=Strict` côté serveur — le navigateur l'envoie automatiquement à chaque refresh.

### Intercepteur Axios — renouvellement silencieux

```js
// src/api/client.js
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const apiClient = axios.create({ baseURL: '/api/v1', withCredentials: true });

// Injecte le token dans chaque requête
apiClient.interceptors.request.use(config => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Renouvelle le token automatiquement si 401
apiClient.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post('/api/v1/auth/refresh', {}, { withCredentials: true });
        useAuthStore.getState().setAccessToken(data.access_token);
        original.headers.Authorization = `Bearer ${data.access_token}`;
        return apiClient(original);
      } catch {
        useAuthStore.getState().logout(); // Redirige vers /login
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### RBAC côté API (backend)

Le backend vérifie :
- `JWT.sub` = `user_id` valide
- `clients.owner_id = user_id` pour le slug demandé  
- `role IN ('owner', 'admin')` — les visiteurs n'ont aucun accès au studio

Endpoint protégé : toute route `/api/v1/studio/:slug/*` exige le middleware `requireOwner(slug)`.

### AuthGuard React

```jsx
// src/components/auth/AuthGuard.jsx
export default function AuthGuard({ children }) {
  const { accessToken, isLoading } = useAuthStore();
  const { slug } = useParams();

  if (isLoading) return <FullScreenLoader />;
  if (!accessToken) return <Navigate to={`/studio/${slug}/login`} replace />;
  return children;
}

// App.jsx
<Routes>
  <Route path="/studio/:slug/login" element={<LoginPage />} />
  <Route path="/studio/:slug/*" element={
    <AuthGuard><StudioLayout /></AuthGuard>
  } />
</Routes>
```

---

## 5.2 — Architecture du Studio : Shell 2 panneaux

### Layout principal

```jsx
// src/components/layout/StudioLayout.jsx
export default function StudioLayout() {
  const { slug } = useParams();
  useStudioInit(slug); // Charge skin + data depuis l'API au mount

  return (
    <div className="studio-shell">
      <StudioTopbar slug={slug} />
      <div className="studio-body">
        <LeftPanel />   {/* 380px fixe, scrollable */}
        <RightPanel />  {/* flex-grow, iframe preview */}
      </div>
    </div>
  );
}
```

### Panneau gauche — onglets éditeur

```jsx
// src/components/layout/LeftPanel.jsx
const TABS = [
  { id: 'tokens',       label: 'Thème',        icon: PaletteIcon },
  { id: 'architecture', label: 'Sections',     icon: LayoutIcon },
  { id: 'content',      label: 'Contenu',      icon: EditIcon },
  { id: 'assets',       label: 'Assets',       icon: ImageIcon },
  { id: 'addons',       label: 'Add-ons',      icon: ZapIcon },
  { id: 'history',      label: 'Historique',   icon: ClockIcon },
];

export default function LeftPanel() {
  const [activeTab, setActiveTab] = useState('tokens');
  return (
    <aside className="left-panel">
      <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />
      <div className="tab-content">
        {activeTab === 'tokens'       && <TokensEditor />}
        {activeTab === 'architecture' && <ArchitectureEditor />}
        {activeTab === 'content'      && <ContentEditor />}
        {activeTab === 'assets'       && <AssetsEditor />}
        {activeTab === 'addons'       && <AddonsEditor />}
        {activeTab === 'history'      && <HistoryPanel />}
      </div>
      <PublishButton />
    </aside>
  );
}
```

### Panneau droit — iframe preview + viewport

```jsx
// src/components/layout/RightPanel.jsx
const VIEWPORTS = [
  { id: 'mobile',  label: '375px', width: 375 },
  { id: 'tablet',  label: '768px', width: 768 },
  { id: 'desktop', label: '100%',  width: '100%' },
];

export default function RightPanel() {
  const [viewport, setViewport] = useState('desktop');
  const current = VIEWPORTS.find(v => v.id === viewport);

  return (
    <section className="right-panel">
      <ViewportToolbar viewports={VIEWPORTS} active={viewport} onChange={setViewport} />
      <div className="preview-container">
        <PreviewFrame width={current.width} />
      </div>
    </section>
  );
}
```

---

## 5.3 — Gestion d'état Zustand

### Store skin central

```js
// src/store/useSkinStore.js
import { create } from 'zustand';
import { temporal } from 'zundo'; // undo/redo middleware
import { persist } from 'zustand/middleware';
import { patchSkin } from '../api/skin.api';
import { debounce } from 'lodash';

const debouncedPatch = debounce(async (slug, patch) => {
  await patchSkin(slug, patch);
}, 800); // 800ms après le dernier changement

export const useSkinStore = create(
  temporal(
    persist(
      (set, get) => ({
        skin: null,
        slug: null,
        isDirty: false,
        isSaving: false,
        lastSavedAt: null,

        setSkin: (skin) => set({ skin }),
        setSlug: (slug) => set({ slug }),

        // Mise à jour partielle + PATCH API automatique
        updateToken: (path, value) => {
          set(state => {
            const newSkin = deepSet(state.skin, path, value);
            // Envoie le PATCH en arrière-plan (debounced)
            debouncedPatch(state.slug, { [path]: value });
            // postMessage vers l'iframe pour preview instantanée
            window.previewFrame?.contentWindow?.postMessage(
              { type: 'SKIN_PATCH', payload: { [path]: value } }, '*'
            );
            return { skin: newSkin, isDirty: true };
          });
        },

        markSaved: () => set({ isDirty: false, lastSavedAt: new Date() }),
      }),
      {
        name: 'studio-skin-draft', // Clé localStorage pour récupérer le travail
        partialize: (state) => ({ skin: state.skin, slug: state.slug }),
      }
    ),
    { limit: 50 } // Max 50 états dans l'historique undo
  )
);

// Undo/Redo exposés
export const useTemporalSkinStore = useSkinStore.temporal;
```

### Raccourcis clavier undo/redo

```js
// src/hooks/useKeyboardShortcuts.js
import { useTemporalSkinStore } from '../store/useSkinStore';

export function useKeyboardShortcuts() {
  const { undo, redo } = useTemporalSkinStore();

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault(); undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault(); redo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);
}
```

---

## 5.4 — Éditeur de tokens (thème, typographie, spacing)

### Structure du TokensEditor

```jsx
// src/components/editor/TokensEditor.jsx
export default function TokensEditor() {
  const { skin, updateToken } = useSkinStore();
  if (!skin) return null;

  return (
    <div className="tokens-editor">
      <Section title="Couleurs — Mode sombre">
        <ColorRow label="Fond principal"     path="theme.dark.--bg"       value={skin.theme.dark['--bg']} onChange={updateToken} />
        <ColorRow label="Accent principal"   path="theme.dark.--accent"   value={skin.theme.dark['--accent']} onChange={updateToken} />
        <ColorRow label="Texte"              path="theme.dark.--text"     value={skin.theme.dark['--text']} onChange={updateToken} />
        <ColorRow label="Muted"              path="theme.dark.--muted"    value={skin.theme.dark['--muted']} onChange={updateToken} />
        <ColorRow label="Surface"            path="theme.dark.--surface"  value={skin.theme.dark['--surface']} onChange={updateToken} />
      </Section>

      <Section title="Couleurs — Mode clair">
        <ColorRow label="Fond principal"     path="theme.light.--bg"      value={skin.theme.light['--bg']} onChange={updateToken} />
        {/* ... idem */}
      </Section>

      <Section title="Typographie">
        <FontSelector  label="Police principale" path="typography.--font-main"  value={skin.typography['--font-main']} onChange={updateToken} />
        <FontSelector  label="Police code"       path="typography.--font-mono"  value={skin.typography['--font-mono']} onChange={updateToken} />
        <SliderRow     label="Taille de base"    path="typography.--font-size-base" value={skin.typography['--font-size-base']} unit="px" min={12} max={20} onChange={updateToken} />
        <SliderRow     label="Line height"       path="typography.--line-height" value={skin.typography['--line-height']} unit="" min={1.2} max={2} step={0.05} onChange={updateToken} />
      </Section>

      <Section title="Espacements">
        <SliderRow label="Spacing XS"  path="tokens.spacing.--space-xs"  value={skin.tokens?.spacing?.['--space-xs']} unit="rem" min={0.25} max={1} step={0.05} onChange={updateToken} />
        <SliderRow label="Spacing SM"  path="tokens.spacing.--space-sm"  value={skin.tokens?.spacing?.['--space-sm']} unit="rem" min={0.5}  max={2} step={0.1}  onChange={updateToken} />
        <SliderRow label="Spacing MD"  path="tokens.spacing.--space-md"  value={skin.tokens?.spacing?.['--space-md']} unit="rem" min={1}    max={4} step={0.25} onChange={updateToken} />
      </Section>

      <Section title="Formes & Bordures">
        <SliderRow label="Border radius" path="tokens.shape.--radius"    value={skin.tokens?.shape?.['--radius']} unit="px" min={0} max={24} step={1} onChange={updateToken} />
        <ColorRow  label="Couleur bord"  path="tokens.shape.--border"    value={skin.tokens?.shape?.['--border']} onChange={updateToken} />
      </Section>

      <Section title="Animations">
        <SliderRow label="Durée courte"  path="animations.durations.short"  value={skin.animations?.durations?.short}  unit="ms" min={100} max={500}  step={50} onChange={updateToken} />
        <SliderRow label="Durée moyenne" path="animations.durations.medium" value={skin.animations?.durations?.medium} unit="ms" min={300} max={1200} step={50} onChange={updateToken} />
        <SliderRow label="Durée longue"  path="animations.durations.long"   value={skin.animations?.durations?.long}   unit="ms" min={600} max={3000} step={100} onChange={updateToken} />
        <SliderRow label="Parallax"      path="animations.parallaxFactor"   value={skin.animations?.parallaxFactor}    unit="" min={0} max={0.5} step={0.01} onChange={updateToken} />
      </Section>
    </div>
  );
}
```

### Composant ColorRow (color picker natif + hex input)

```jsx
function ColorRow({ label, path, value, onChange }) {
  return (
    <div className="token-row">
      <label>{label}</label>
      <div className="color-input-group">
        <input
          type="color"
          value={value || '#000000'}
          onChange={e => onChange(path, e.target.value)}
        />
        <input
          type="text"
          value={value || ''}
          maxLength={9}
          onChange={e => {
            if (/^#[0-9A-Fa-f]{0,8}$/.test(e.target.value)) {
              onChange(path, e.target.value);
            }
          }}
        />
      </div>
    </div>
  );
}
```

---

## 5.5 — Éditeur d'architecture (drag-and-drop des sections)

L'architecture du portfolio est pilotée par `skin.architecture` — un tableau ordonné de blocs. L'éditeur permet de réordonner, activer/désactiver et configurer chaque bloc.

```js
// Exemple de skin.architecture
[
  { id: "hero-1",      component: "HeroTerminal",      visible: true,  props: {} },
  { id: "marquee-1",   component: "MarqueeBar",         visible: true,  props: {} },
  { id: "skills-1",    component: "SkillsServerRack",   visible: true,  props: {} },
  { id: "exp-1",       component: "ExperienceTimeline", visible: false, props: {} },
]
```

```jsx
// src/components/editor/ArchitectureEditor.jsx
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function ArchitectureEditor() {
  const { skin, updateToken } = useSkinStore();
  const arch = skin?.architecture ?? [];

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(arch);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    updateToken('architecture', reordered);
  };

  const toggleVisible = (id) => {
    const updated = arch.map(block =>
      block.id === id ? { ...block, visible: !block.visible } : block
    );
    updateToken('architecture', updated);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="architecture">
        {(provided) => (
          <ul ref={provided.innerRef} {...provided.droppableProps}>
            {arch.map((block, index) => (
              <Draggable key={block.id} draggableId={block.id} index={index}>
                {(provided) => (
                  <li ref={provided.innerRef} {...provided.draggableProps}>
                    <span {...provided.dragHandleProps} className="drag-handle">⠿</span>
                    <span className="block-name">{block.component}</span>
                    <Toggle checked={block.visible} onChange={() => toggleVisible(block.id)} />
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}
```

---

## 5.6 — Communication iframe ↔ Studio (postMessage)

### Côté Studio (émetteur)

```js
// src/hooks/useIframeBridge.js
export function useIframeBridge(iframeRef) {
  // Appelé par updateToken du store — envoie la mise à jour à l'iframe
  const postPatch = useCallback((patch) => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'SKIN_PATCH', payload: patch },
      process.env.VITE_ENGINE_ORIGIN // ex: https://engine.portfolioengine.com
    );
  }, [iframeRef]);

  // Écoute les events de l'iframe (ex: scroll, hover, click sur un bloc)
  useEffect(() => {
    const handler = (e) => {
      if (e.origin !== process.env.VITE_ENGINE_ORIGIN) return;
      if (e.data.type === 'BLOCK_CLICK') {
        // Sélectionner le bloc dans le panneau gauche
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return { postPatch };
}
```

### Côté moteur React (récepteur)

Le moteur React doit écouter ces messages pour appliquer les patches de skin en live, **sans recharger la page**.

```js
// apps/engine/src/hooks/usePreviewBridge.js
export function usePreviewBridge(setSkin) {
  useEffect(() => {
    const handler = (e) => {
      // Vérifier l'origine (sécurité)
      if (e.origin !== process.env.VITE_STUDIO_ORIGIN) return;

      if (e.data.type === 'SKIN_PATCH') {
        setSkin(prev => deepMerge(prev, e.data.payload));
        // Réinjecter les CSS custom properties immédiatement
        injectCssVars(e.data.payload);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [setSkin]);
}

// Injection ciblée des CSS vars (sans re-render complet)
function injectCssVars(patch) {
  Object.entries(patch).forEach(([key, value]) => {
    if (key.startsWith('--')) {
      document.documentElement.style.setProperty(key, value);
    }
  });
}
```

L'iframe est chargée avec l'URL du moteur en mode `?preview=true&slug=juvanio`. En mode preview, le moteur n'appelle pas l'API — il utilise les données injectées via postMessage.

---

## 5.7 — Upload d'assets (URL pré-signée S3)

### Flux complet

```
1. Studio : POST /api/v1/studio/:slug/assets/presign
   { filename: "photo.jpg", contentType: "image/jpeg" }
   => { uploadUrl: "https://s3.amazonaws.com/...?X-Amz-...", cdnUrl: "https://cdn.portfolioengine.com/juvanio/photo.jpg" }

2. Studio : PUT uploadUrl  (upload direct navigateur → S3, sans passer par le serveur)
   Headers: { "Content-Type": "image/jpeg" }
   Body: <binary file>

3. Studio : PATCH /api/v1/studio/:slug/skin
   { assets: { heroPhoto: cdnUrl } }
   => Enregistre l'URL CDN en base dans skins.assets

4. Studio : postMessage({ type: "SKIN_PATCH", payload: { "assets.heroPhoto": cdnUrl } })
   => Moteur met à jour l'image dans l'iframe immédiatement
```

### Composant AssetsEditor

```jsx
// src/components/editor/AssetsEditor.jsx
export default function AssetsEditor() {
  const { slug } = useParams();
  const { skin, updateToken } = useSkinStore();
  const [uploading, setUploading] = useState({});

  const handleUpload = async (assetKey, file) => {
    if (!file) return;
    // Validation locale
    const maxSize = assetKey === 'cv' ? 5 * 1024 * 1024 : 2 * 1024 * 1024;
    if (file.size > maxSize) return toast.error('Fichier trop volumineux');

    setUploading(prev => ({ ...prev, [assetKey]: true }));
    try {
      // 1. Obtenir l'URL pré-signée
      const { uploadUrl, cdnUrl } = await getPresignedUrl(slug, {
        filename: file.name,
        contentType: file.type,
        assetKey,
      });
      // 2. Upload direct vers S3
      await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
      // 3. Sauvegarder l'URL CDN dans le skin
      updateToken(`assets.${assetKey}`, cdnUrl);
      toast.success('Asset uploadé avec succès');
    } catch (err) {
      toast.error('Erreur lors de l\'upload');
    } finally {
      setUploading(prev => ({ ...prev, [assetKey]: false }));
    }
  };

  return (
    <div className="assets-editor">
      <AssetUploader
        label="Photo de profil"
        assetKey="heroPhoto"
        accept="image/jpeg,image/png,image/webp"
        currentUrl={skin?.assets?.heroPhoto}
        loading={uploading.heroPhoto}
        onUpload={(file) => handleUpload('heroPhoto', file)}
      />
      <AssetUploader
        label="Favicon"
        assetKey="favicon"
        accept="image/x-icon,image/png,image/svg+xml"
        currentUrl={skin?.assets?.favicon}
        loading={uploading.favicon}
        onUpload={(file) => handleUpload('favicon', file)}
      />
      <AssetUploader
        label="CV (PDF)"
        assetKey="cv"
        accept="application/pdf"
        currentUrl={skin?.assets?.cv}
        loading={uploading.cv}
        onUpload={(file) => handleUpload('cv', file)}
      />
    </div>
  );
}
```

---

## 5.8 — Bibliothèque de skins de base

### Trois skins pré-configurés

| Skin              | Palette               | Typographie          | Style addons       |
|-------------------|-----------------------|----------------------|--------------------|
| Terminal Dark     | #0a0a0a / #00ff88     | JetBrains Mono       | cursor+noise+boot  |
| Corporate Light   | #ffffff / #2563eb     | Inter / Inter        | aucun              |
| Creative Minimal  | #fafaf9 / #ef4444     | Syne / JetBrains Mono| cursor custom      |

Ces skins sont stockés en base avec `client_id = NULL` (templates globaux). Un utilisateur peut en charger un via :

```js
// src/api/skin.api.js
export async function cloneSkin(slug, templateSkinId) {
  const { data } = await apiClient.post(
    `/studio/${slug}/skin/clone`,
    { sourceSkinId: templateSkinId }
  );
  return data; // Nouveau skin avec client_id du client
}
```

### SkinLibraryModal

```jsx
export default function SkinLibraryModal({ onSelect }) {
  const [templates, setTemplates] = useState([]);
  useEffect(() => {
    apiClient.get('/skins/templates').then(r => setTemplates(r.data));
  }, []);

  return (
    <Modal title="Bibliothèque de skins">
      <div className="skin-grid">
        {templates.map(t => (
          <SkinCard
            key={t.id}
            name={t.name}
            preview={t.previewUrl}
            onApply={() => onSelect(t.id)}
          />
        ))}
      </div>
    </Modal>
  );
}
```

---

## 5.9 — Bouton "Publier" + versionnement

### Flux de publication

```
Utilisateur clique "Publier"
  => Studio : POST /api/v1/studio/:slug/publish
  => API :
     1. Snapshot du skin actuel → INSERT skin_history (rollback)
     2. UPDATE skins SET is_published=true, published_at=NOW()
     3. Déclenchement webhook → Build Queue
     4. Réponse : { publishedAt, historyId, buildId }
  => Studio : Affiche confirmation + lien vers le portfolio
  => Build Queue :
     1. GET /api/v1/portfolio/:slug (skin + data complets)
     2. Génération HTML statique (Astro/Vite SSG)
     3. Deploy sur CDN (~30 secondes)
```

### PublishButton

```jsx
// src/components/publish/PublishButton.jsx
export default function PublishButton() {
  const { slug } = useParams();
  const { isDirty } = useSkinStore();
  const [publishing, setPublishing] = useState(false);

  const handlePublish = async () => {
    if (!confirm('Publier cette version ? Un snapshot de rollback sera créé.')) return;
    setPublishing(true);
    try {
      const result = await publishSkin(slug);
      toast.success(`Publié le ${new Date(result.publishedAt).toLocaleString('fr-FR')}`);
    } catch {
      toast.error('Erreur lors de la publication');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <button
      className={`publish-btn ${isDirty ? 'has-changes' : ''}`}
      onClick={handlePublish}
      disabled={publishing}
    >
      {publishing ? '⏳ Publication...' : '🚀 Publier'}
      {isDirty && <span className="dirty-indicator" title="Modifications non publiées" />}
    </button>
  );
}
```

---

## 5.10 — Historique et rollback

### HistoryPanel

```jsx
// src/components/publish/HistoryPanel.jsx
export default function HistoryPanel() {
  const { slug } = useParams();
  const { setSkin } = useSkinStore();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    apiClient.get(`/studio/${slug}/skin/history`)
      .then(r => setHistory(r.data));
  }, [slug]);

  const handleRollback = async (historyId) => {
    if (!confirm('Restaurer cette version ? Le skin actuel sera remplacé.')) return;
    const { skin } = await apiClient.post(`/studio/${slug}/skin/rollback/${historyId}`);
    setSkin(skin); // Met à jour le store local
    // La publication du rollback déclenche automatiquement un rebuild
    toast.success('Version restaurée et re-publiée');
  };

  return (
    <div className="history-panel">
      <h3>Historique des publications</h3>
      <ul>
        {history.map(h => (
          <li key={h.id}>
            <span>{new Date(h.created_at).toLocaleString('fr-FR')}</span>
            <button onClick={() => handleRollback(h.id)}>↩ Restaurer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

L'API retourne les **10 dernières publications** (limitées côté backend) :
```sql
SELECT id, created_at
FROM skin_history
WHERE skin_id = $1
ORDER BY created_at DESC
LIMIT 10;
```

---

## 5.11 — Initialisation du Studio

```js
// src/hooks/useStudioInit.js
export function useStudioInit(slug) {
  const { setSkin, setSlug } = useSkinStore();
  const { setData } = useDataStore();
  const { skin: draftSkin } = useSkinStore.getState(); // Draft localStorage

  useEffect(() => {
    setSlug(slug);

    // Si un brouillon localStorage existe pour ce slug, le proposer
    if (draftSkin?.slug === slug) {
      const useDraft = confirm('Un brouillon non publié existe. Reprendre ?');
      if (useDraft) return; // Le store utilise déjà le draft
    }

    // Charger depuis l'API
    Promise.all([
      apiClient.get(`/studio/${slug}/skin`),
      apiClient.get(`/portfolio/${slug}/data/fr`),
      apiClient.get(`/portfolio/${slug}/data/en`),
    ]).then(([skinRes, dataFr, dataEn]) => {
      setSkin(skinRes.data);
      setData({ fr: dataFr.data, en: dataEn.data });
    });
  }, [slug]);
}
```

---

## 5.12 — Éditeur de contenu (ContentEditor)

Le `ContentEditor` permet de modifier les sections textuelles du portfolio (`client_data`) en fr et en.

```jsx
// src/components/editor/ContentEditor.jsx
const SECTIONS = ['hero', 'skills', 'experience', 'formation', 'contact', 'navbar', 'footer'];

export default function ContentEditor() {
  const { slug } = useParams();
  const { data, setSection } = useDataStore();
  const [lang, setLang] = useState('fr');
  const [section, setActiveSection] = useState('hero');
  const sectionData = data?.[lang]?.[section] ?? {};

  const handleChange = debounce(async (key, value) => {
    const updated = { ...sectionData, [key]: value };
    setSection(lang, section, updated);
    await apiClient.patch(`/studio/${slug}/data/${lang}/${section}`, updated);
  }, 600);

  return (
    <div className="content-editor">
      <div className="content-editor-header">
        <select value={lang} onChange={e => setLang(e.target.value)}>
          <option value="fr">🇫🇷 Français</option>
          <option value="en">🇬🇧 English</option>
        </select>
        <select value={section} onChange={e => setActiveSection(e.target.value)}>
          {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <ContentFieldsRenderer
        data={sectionData}
        onChange={handleChange}
      />
    </div>
  );
}
```

---

## 5.13 — Gestion du AddonsEditor

```jsx
// src/components/editor/AddonsEditor.jsx
const ADDONS = [
  { key: 'customCursor',  label: 'Curseur personnalisé',  desc: 'Curseur animé en remplacement du curseur système' },
  { key: 'bootSequence',  label: 'Boot sequence',          desc: 'Animation de démarrage au premier chargement' },
  { key: 'noiseOverlay',  label: 'Grain / Noise overlay',  desc: 'Texture de grain sur le fond' },
  { key: 'networkCanvas', label: 'Canvas réseau',           desc: 'Animation de particules en arrière-plan' },
];

export default function AddonsEditor() {
  const { skin, updateToken } = useSkinStore();
  const addons = skin?.addons ?? {};

  return (
    <div className="addons-editor">
      {ADDONS.map(addon => (
        <div key={addon.key} className="addon-row">
          <div>
            <strong>{addon.label}</strong>
            <p>{addon.desc}</p>
          </div>
          <Toggle
            checked={!!addons[addon.key]}
            onChange={val => updateToken(`addons.${addon.key}`, val)}
          />
        </div>
      ))}

      {addons.customCursor && (
        <Section title="Configuration du curseur">
          <select
            value={skin?.cursor?.type ?? 'custom'}
            onChange={e => updateToken('cursor.type', e.target.value)}
          >
            <option value="custom">Custom (SVG)</option>
            <option value="crosshair">Crosshair</option>
            <option value="dot">Point</option>
          </select>
        </Section>
      )}
    </div>
  );
}
```

---

## 5.14 — Récapitulatif des endpoints API utilisés par le Studio

| Méthode | Endpoint | Usage |
|---------|----------|-------|
| `POST` | `/auth/login` | Connexion, obtention des tokens |
| `POST` | `/auth/refresh` | Renouvellement silencieux du access_token |
| `GET` | `/studio/:slug/skin` | Chargement initial du skin |
| `PATCH` | `/studio/:slug/skin` | Mise à jour partielle du skin (debounced) |
| `GET` | `/studio/:slug/skin/history` | Liste des 10 dernières publications |
| `POST` | `/studio/:slug/skin/rollback/:id` | Restauration d'une version |
| `GET` | `/portfolio/:slug/data/:lang` | Chargement du contenu (fr + en) |
| `PATCH` | `/studio/:slug/data/:lang/:section` | Mise à jour d'une section de contenu |
| `POST` | `/studio/:slug/assets/presign` | Obtenir URL pré-signée S3 |
| `POST` | `/studio/:slug/publish` | Publication + snapshot + webhook build |
| `GET` | `/skins/templates` | Liste des skins de bibliothèque |
| `POST` | `/studio/:slug/skin/clone` | Cloner un skin template |

---

## 5.15 — Dépendances NPM du Studio

```json
{
  "dependencies": {
    "react": "^18",
    "react-router-dom": "^6",
    "zustand": "^4",
    "zundo": "^2",
    "@hello-pangea/dnd": "^16",
    "axios": "^1",
    "lodash": "^4",
    "react-hot-toast": "^2"
  },
  "devDependencies": {
    "vite": "^5",
    "@vitejs/plugin-react": "^4"
  }
}
```

---

## 5.16 — Variables d'environnement

```env
# apps/studio/.env
VITE_API_BASE_URL=https://api.portfolioengine.com/api/v1
VITE_ENGINE_ORIGIN=https://engine.portfolioengine.com
VITE_STUDIO_ORIGIN=https://studio.portfolioengine.com

# En dev local
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_ENGINE_ORIGIN=http://localhost:5174
VITE_STUDIO_ORIGIN=http://localhost:5173
```

---

*Document généré pour Portfolio Builder Engine v3.0 — Phase 5 Skin Studio*