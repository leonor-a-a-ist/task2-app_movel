'use client';

import { createElement, ElementType } from 'react';
import { useTextType } from '@/hooks/useTextType';
import type { UseTextTypeArgs } from '@/hooks/useTextType';

/**
 * Props do componente TextType
 */
interface TextTypeProps extends UseTextTypeArgs {
    as?: ElementType;
    className?: string;
    cursorCharacter?: string;
    cursorClassName?: string;
}

/**
 * Componente visual que usa o hook useTextType
 * É responsável apenas pela renderização do texto e do cursor
 */
const TextType = ({
    text,
    as: Component = 'div',
    className = '',
    showCursor = true,
    cursorCharacter = '|',
    cursorClassName = '',
    ...hookProps
}: TextTypeProps) => {
    const {
        displayedText,
        getCurrentTextColor,
        cursorRef,
        containerRef,
        shouldHideCursor
    } = useTextType({ text, showCursor, ...hookProps });

    return createElement(
        Component,
        {
            ref: containerRef,
            className: `inline-block align-top whitespace-pre-wrap  ${className}`,
            ...hookProps
        },
        <span className="inline" style={{ color: getCurrentTextColor() }}>
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
