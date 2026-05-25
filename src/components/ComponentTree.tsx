import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';


export default function ComponentTree() {
    return (
        <div style={{textAlign:'left'}}>
            <SimpleTreeView>
                <TreeItem itemId={"logicGates"} label="Logic Gates">
                    <TreeItem itemId={"andGate"} label="AND Gate" />
                </TreeItem>
            </SimpleTreeView>
        </div>
        )
}