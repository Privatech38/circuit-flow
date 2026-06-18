import 'material-symbols/rounded.css'
import './Toolbar.css'
import type {ButtonHTMLAttributes} from "react";



export default function Toolbar() {

    interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
        children: React.ReactNode;
    }

    return (
        <div id='toolbar'>
            <Item>
                <Button id="toolbar-button">
                    <span className="material-symbols-rounded button_icon" style={{ color: '#03C03C' }}>play_arrow</span>
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