import {Layout, Model, type IJsonModel, TabNode} from "flexlayout-react";
import 'flexlayout-react/style/alpha_light.css';
import modelJson from "./assets/layouts/default_layout.json";
import EditorTab from "./editor/EditorTab.tsx";
import ComponentTree from "./components/ComponentTree.tsx";

const model = Model.fromJson(modelJson as IJsonModel);

function App() {
  const factory = (node: TabNode) => {
    const component = node.getComponent();

    if (component == "editor") {
      return EditorTab();
    }

    if (component == "componentTree") {
      return ComponentTree();
    }

    if (component === "placeholder") {
      return <div>{node.getName()}</div>;
    }
  }

  return (
      <Layout
          model={model}
          factory={factory} />
  );
}

export default App
