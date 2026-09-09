import 'material-symbols/rounded.css'
import './Toolbar.css'
import type {ButtonHTMLAttributes} from "react";
import {useSyncExternalStore} from "react";
import {
    getSimulationState,
    pauseSimulation,
    resumeSimulation,
    startSimulation,
    stopSimulation,
    subscribeToSimulationState
} from "@/simulation/SimulationManager.ts";

export default function Toolbar() {

    const simulationState = useSyncExternalStore(subscribeToSimulationState, getSimulationState);

    interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
        children: React.ReactNode;
    }

    return (
        <div id='toolbar'>
            {simulationState == "stopped" && <Item>
                <Button id="start-button" title={'Run Simulation'} onClick={startSimulation}>
                    <span className="material-symbols-rounded button_icon" style={{color: '#03C03C'}}>play_arrow</span>
                </Button>
            </Item>}
            {simulationState == "running" &&
            (<>
                <Item>
                <Button id="pause-button" title={'Pause Simulation'} onClick={pauseSimulation}>
                    <span className="material-symbols-rounded button_icon"
                          style={{color: '#fb5700', transform: 'scale(1.2)'}}>pause</span>
                </Button>
            </Item>
            <Item>
                <Button id="stop-button" title={'Stop Simulation'} onClick={stopSimulation}>
                    <span className="material-symbols-rounded button_icon" style={{ color: '#d21010' }}>stop</span>
                </Button>
            </Item>
            </>)}
            {simulationState == "paused" && <Item>
                <Button id="resume-button" title={'Resume Simulation'} onClick={resumeSimulation}>
                    <span className="material-symbols-rounded button_icon" style={{color: '#03C03C'}}>resume</span>
                </Button>
            </Item>}
        </div>
    )

    function Item({children}: {children: React.ReactNode}) {
        return (
            <div className={'toolbar__item'}>
                {children}
            </div>
        )
    }

    function Button({ children, className, ...rest }: ButtonProps) {
        return (
            <button className={`toolbar__button ${className ?? ''}`} {...rest}>
                {children}
            </button>
        );
    }
}