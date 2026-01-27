import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';

/* Define os argumentos aceites pelo hook useTextType */
export interface UseTextTypeArgs {
    text: string | string[],
    typingSpeed?: number,
    initialDelay?: number,
    pauseDuration?: number,
    deletingSpeed?: number,
    loop?: boolean,
    showCursor?: boolean,
    hideCursorWhileTyping?: boolean,
    cursorBlinkDuration?: number,
    textColors?: string[],
    variableSpeed?: { min: number, max: number } | null,
    onSentenceComplete?: (completedSentence: string, sentenceIndex: number) => void,
    startOnVisible?: boolean,
    reverseMode?: boolean,
}

/* Hook para criar efeito de "typing" e "deleting" */
export function useTextType({
    text,
    typingSpeed = 50,
    initialDelay = 0,
    pauseDuration = 2000,
    deletingSpeed = 30,
    loop = true,
    showCursor = true,
    hideCursorWhileTyping = false,
    cursorBlinkDuration = 0.5,
    textColors = [],
    variableSpeed,
    onSentenceComplete,
    startOnVisible = false,
    reverseMode = false,
}: UseTextTypeArgs) {

    const [displayedText, setDisplayedText] = useState('');
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(!startOnVisible);

    const cursorRef = useRef(null);
    const containerRef = useRef(null);

    const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

    /* Calcula uma velocidade aleatória se variableSpeed estiver ativo */
    const getRandomSpeed = useCallback(() => {
        if (!variableSpeed) return typingSpeed;
        const { min, max } = variableSpeed;
        return Math.random() * (max - min) + min;
    }, [variableSpeed, typingSpeed]);

    /* Cor do texto atual (em case de haver várias) */
    const getCurrentTextColor = () => {
        return textColors[currentTextIndex % textColors.length] || 'inherit';
    };

    useEffect(() => {
        if (!startOnVisible || !containerRef.current) return;

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.1 }
        );

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [startOnVisible]);

    /* Animação do cursor */
    useEffect(() => {
        if (showCursor && cursorRef.current) {
            gsap.set(cursorRef.current, { opacity: 1 });
            gsap.to(cursorRef.current, {
                opacity: 0,
                duration: cursorBlinkDuration,
                repeat: -1,
                yoyo: true,
                ease: 'power2.inOut'
            });
        }
    }, [showCursor, cursorBlinkDuration]);

    /* Efeito de typing e deleting */
    useEffect(() => {
        if (!isVisible) return;

        let timeout: ReturnType<typeof setTimeout>;

        const currentText = textArray[currentTextIndex];
        const processedText = reverseMode ? currentText.split('').reverse().join('') : currentText;

        const executeTypingAnimation = () => {

            /* Apagar */
            if (isDeleting) {

                if (displayedText === '') {
                    setIsDeleting(false);

                    if (currentTextIndex === textArray.length - 1 && !loop) {
                        return;
                    }

                    if (onSentenceComplete) {
                        onSentenceComplete(textArray[currentTextIndex], currentTextIndex);
                    }

                    setCurrentTextIndex(prev => (prev + 1) % textArray.length);
                    setCurrentCharIndex(0);

                    timeout = setTimeout(() => { }, pauseDuration);

                } else {
                    timeout = setTimeout(() => {
                        setDisplayedText(prev => prev.slice(0, -1));
                    }, deletingSpeed);
                }
            
            /* Digitar */
            } else {
                if (currentCharIndex < processedText.length) {
                    timeout = setTimeout(
                        () => {
                            setDisplayedText(prev => prev + processedText[currentCharIndex]);
                            setCurrentCharIndex(prev => prev + 1);
                        }, variableSpeed ? getRandomSpeed() : typingSpeed
                    );

                } else if (textArray.length >= 1) {
                    if (!loop && currentTextIndex === textArray.length - 1) return;

                    timeout = setTimeout(() => {
                        setIsDeleting(true);
                    }, pauseDuration);
                }

            }
        };

        /* Delay inicial no caso de ser a primeira palavra */
        if (currentCharIndex === 0 && !isDeleting && displayedText === '') {
            timeout = setTimeout(executeTypingAnimation, initialDelay);
        } else {
            executeTypingAnimation();
        }

        return () => clearTimeout(timeout);
    }, [
        currentCharIndex,
        displayedText,
        isDeleting,
        typingSpeed,
        deletingSpeed,
        pauseDuration,
        textArray,
        currentTextIndex,
        loop,
        initialDelay,
        isVisible,
        reverseMode,
        variableSpeed,
        onSentenceComplete
    ]);

    const shouldHideCursor =
        hideCursorWhileTyping &&
        (currentCharIndex < textArray[currentTextIndex].length || isDeleting);

    return {
        displayedText,
        getCurrentTextColor,
        cursorRef,
        containerRef,
        shouldHideCursor
    };
}

