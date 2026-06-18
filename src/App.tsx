import 'dockview-react/dist/styles/dockview.css';
import './App.css'
import EditorTab from "./editor/EditorTab.tsx";
import ComponentTree from "./components/ComponentTree.tsx";
import Toolbar from "@/toolbar/Toolbar.tsx";
import {type DockviewApi, DockviewReact, type DockviewReadyEvent, type IDockviewPanelProps} from "dockview-react";

function App() {

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


  }

  return (
      <div id='app'>
        <Toolbar/>
        <DockviewReact
            className="dockview-theme-light"
            style={{ width: '100%', height: '100%' }}
            components={components}
            onReady={onReady}/>
      </div>
  );
}

export default App
