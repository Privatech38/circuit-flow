import {SimpleTreeView} from '@mui/x-tree-view/SimpleTreeView';
import {TreeItem} from '@mui/x-tree-view/TreeItem';
import AndGateSvg from '../assets/components/gates/AndGate.svg?react';

export default function ComponentTree() {
    return (
        <div style={{textAlign: 'left'}}>
            <SimpleTreeView>
                <TreeItem itemId={"logicGates"} label="Logic Gates">
                    <TreeItem itemId={"andGate"} label="AND Gate"
                              slots={{icon: () => <AndGateSvg stroke-width={6} viewBox="-3 -3 61 56"/>}}
                    />
                </TreeItem>
            </SimpleTreeView>
        </div>
    )
}