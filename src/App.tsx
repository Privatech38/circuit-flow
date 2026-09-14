import 'dockview-react/dist/styles/dockview.css';
import './App.css'
import {useSyncExternalStore} from "react";
import EditorTab from "./editor/EditorTab.tsx";
import ComponentTree from "./components/ComponentTree.tsx";
import Toolbar from "@/toolbar/Toolbar.tsx";
import {
  type DockviewApi,
  DockviewReact,
  type DockviewReadyEvent,
  type IDockviewPanelProps,
  themeDark,
  themeLight
} from "dockview-react";
import {ReactFlowProvider} from "@xyflow/react";

const darkSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

function subscribeToColorScheme(callback: () => void): () => void {
  darkSchemeQuery.addEventListener('change', callback);
  return () => darkSchemeQuery.removeEventListener('change', callback);
}

function getIsDarkScheme(): boolean {
  return darkSchemeQuery.matches;
}

function App() {
  const isDark = useSyncExternalStore(subscribeToColorScheme, getIsDarkScheme);

  const components: Record<string, React.FunctionComponent<IDockviewPanelProps>> = {
    editor: () => {
      return EditorTab();
    },
    componentTree: () => {
      return ComponentTree();
    }
  }

  function onReady(event: DockviewReadyEvent) {
    const api: DockviewApi = event.api;

    api.addPanel({
      id: 'editor',
      component: 'editor'
    })

    const leftGroup = api.addEdgeGroup('left', {
      id: 'left-group',
      initialSize: 323,
      minimumSize: 180
    })

    api.addPanel({
      id: 'component-tree',
      component: 'componentTree',
      title: 'Component Tree',
      position: { referenceGroup: leftGroup.id }
    })
  }

  return (
      <div id='app'>
        <ReactFlowProvider>
          <div className="dockview-container">
            <Toolbar/>
            <div className="dockview-viewport">
              <DockviewReact
                  theme={{...(isDark ? themeDark : themeLight), gap: 8}}
                  components={components}
                  onReady={onReady}></DockviewReact>
            </div>
          </div>
        </ReactFlowProvider>
      </div>
  );
}

export default App
