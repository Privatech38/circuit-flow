import 'dockview-react/dist/styles/dockview.css';
import './App.css'
import EditorTab from "./editor/EditorTab.tsx";
import ComponentTree from "./components/ComponentTree.tsx";
import Toolbar from "@/toolbar/Toolbar.tsx";
import {
  type DockviewApi,
  DockviewReact,
  type DockviewReadyEvent,
  type IDockviewPanelProps,
  themeLight
} from "dockview-react";
import {ReactFlowProvider} from "@xyflow/react";

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
          <Toolbar/>
          <DockviewReact
              theme={themeLight}
              components={components}
              onReady={onReady}/>
        </ReactFlowProvider>
      </div>
  );
}

export default App
