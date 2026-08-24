import 'material-symbols/rounded.css'
import './Toolbar.css'
import type {ButtonHTMLAttributes} from "react";
import {startSimulation} from "@/simulation/SimulationManager.ts";

export default function Toolbar() {

    interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
        children: React.ReactNode;
    }

    return (
        <div id='toolbar'>
            <Item>
                <Button id="start-button" title={'Run Simulation'} onClick={startSimulation}>
                    <span className="material-symbols-rounded button_icon" style={{ color: '#03C03C' }}>play_arrow</span>
                </Button>
            </Item>
            <Item>
                <Button id="pause-button" title={'Pause Simulation'}>
                    <span className="material-symbols-rounded button_icon" style={{ color: '#fb5700', transform: 'scale(1.2)' }}>pause</span>
                </Button>
            </Item>
            <Item>
                <Button id="stop-button" title={'Stop Simulation'}>
                    <span className="material-symbols-rounded button_icon" style={{ color: '#d21010' }}>stop</span>
                </Button>
            </Item>
            <Item>
                <Button id="resume-button" title={'Resume Simulation'}>
                    <span className="material-symbols-rounded button_icon" style={{ color: '#03C03C' }}>resume</span>
                </Button>
            </Item>
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