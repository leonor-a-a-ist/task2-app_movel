'use client';

import { createElement } from 'react';
import { useTextType } from '@/pages/hooks/useTextType';

// com uma interface para os argumentos teria verificação do tipo em tempo de compilação
// não sei se é necessário tho, então vou deixar sem por enquanto

// argumentos passados quando uso o componente TextType
const TextType = ({
    text,
    as: Component = 'div',
    className = '',
    showCursor = true,
    cursorCharacter = '|',
    cursorClassName = '',
    ...props
}) => {
    // elementos obtidos do hook useTextType
    const {
        displayedText,
        getCurrentTextColor,
        cursorRef,
        containerRef,
        shouldHideCursor
    } = useTextType({ text, showCursor, ...props });

    return createElement(
        Component,
        {
            ref: containerRef,
            className: `inline-block whitespace-pre-wrap tracking-tight ${className}`,
            ...props
        },
        <span className="inline" style={{ color: getCurrentTextColor() }}>  {/*já tenho a opção do inherit no hook*/}
            {displayedText}
        </span>,
        showCursor && (
            <span
                ref={cursorRef}
                className={`ml-1 inline-block opacity-100 ${shouldHideCursor ? 'hidden' : ''} ${cursorClassName}`}
            >
                {cursorCharacter}
            </span>
        )
    );
};

export default TextType;
