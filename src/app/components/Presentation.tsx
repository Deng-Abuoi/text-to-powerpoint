"use client";

import { useCallback, useMemo, useState } from "react";
import BackwardIcon from "@heroicons/react/24/outline/esm/BackwardIcon";
import ForwardIcon from "@heroicons/react/24/outline/esm/ForwardIcon";
import PlusIcon from "@heroicons/react/24/outline/esm/PlusIcon";
import SparklesIcon from "@heroicons/react/24/outline/esm/SparklesIcon";
import TrashIcon from "@heroicons/react/24/outline/esm/TrashIcon";
import { SlideModel, Slide } from "./Slide";
import { useCopilotReadable, useCopilotAction, useCopilotContext } from "@copilotkit/react-core";
import { CopilotTask } from "@copilotkit/react-core";

export const ActionButton = ({ disabled, onClick, className, children }: {
    disabled?: boolean;
    onClick: () => void;
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <button
            disabled={disabled}
            className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"} ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export const Presentation = () => {
    const [slides, setSlides] = useState<SlideModel[]>([
        {
            title: "Welcome to our presentation!",
            content: "This is the first slide.",
            backgroundImageDescription: "hello",
            spokenNarration: "This is the first slide. Welcome to our presentation!",
        },
    ]);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [generateSlideTaskRunning, setGenerateSlideTaskRunning] = useState(false);

    const currentSlide = useMemo(() => slides[currentSlideIndex], [slides, currentSlideIndex]);

    const updateCurrentSlide = useCallback(
        (partialSlide: Partial<SlideModel>) => {
            setSlides((slides) => [
                ...slides.slice(0, currentSlideIndex),
                { ...slides[currentSlideIndex], ...partialSlide },
                ...slides.slice(currentSlideIndex + 1),
            ]);
        },
        [currentSlideIndex, setSlides]
    );

    // Make slides readable by copilot
    useCopilotReadable({ text: "These are all the slides: " + JSON.stringify(slides) } as any);
    useCopilotReadable({ text: "This is the current slide: " + JSON.stringify(currentSlide) } as any);

    // Set up copilot action for adding slides
    useCopilotAction({
        name: "appendSlide",
        description: "Add a slide after all the existing slides. Call this function multiple times to add multiple slides.",
        argumentAnnotations: [
            {
                name: "title",
                type: "string",
                description: "The title of the slide. Should be a few words long.",
                required: true,
            },
            {
                name: "content",
                type: "string",
                description: "The content of the slide. Should generally consist of a few bullet points.",
                required: true,
            },
            {
                name: "backgroundImageDescription",
                type: "string",
                description: "What to display in the background of the slide. For example, 'dog', 'house', etc.",
                required: false,
            },
        ] as const,
        implementation: async (title: string, content: string, backgroundImageDescription: string) => {
            const newSlide: SlideModel = {
                title,
                content,
                backgroundImageDescription,
                spokenNarration: "",
            };
            setSlides((slides) => [...slides, newSlide]);
        },
    } as any);

    const deleteCurrentSlide = useCallback(() => {
        if (slides.length <= 1) {
            return;
        }
        setSlides((slides) => [...slides.slice(0, currentSlideIndex), ...slides.slice(currentSlideIndex + 1)]);
        setCurrentSlideIndex((i) => (i === 0 ? 0 : i - 1));
    }, [currentSlideIndex, slides.length]);

    const generateSlides = useCallback(async () => {
        setGenerateSlideTaskRunning(true);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Presentation</h1>
                    <div className="flex gap-2">
                        <ActionButton
                            onClick={generateSlides}
                            disabled={generateSlideTaskRunning}
                            className="flex items-center gap-2"
                        >
                            <SparklesIcon className="w-5 h-5" />
                            Generate Slides
                        </ActionButton>
                    </div>
                </div>

                <div className="mb-4">
                    <Slide
                        slide={currentSlide}
                        partialUpdateSlide={updateCurrentSlide}
                    />
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <ActionButton
                            onClick={() => setCurrentSlideIndex((i) => i - 1)}
                            disabled={currentSlideIndex === 0}
                            className="flex items-center gap-2"
                        >
                            <BackwardIcon className="w-5 h-5" />
                            Previous
                        </ActionButton>
                        <ActionButton
                            onClick={() => setCurrentSlideIndex((i) => i + 1)}
                            disabled={currentSlideIndex === slides.length - 1}
                            className="flex items-center gap-2"
                        >
                            Next
                            <ForwardIcon className="w-5 h-5" />
                        </ActionButton>
                    </div>

                    <div className="flex gap-2">
                        <ActionButton
                            onClick={deleteCurrentSlide}
                            disabled={slides.length <= 1}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-700"
                        >
                            <TrashIcon className="w-5 h-5" />
                            Delete
                        </ActionButton>
                        <ActionButton
                            onClick={() => {
                                setSlides((slides) => [
                                    ...slides,
                                    {
                                        title: "New Slide",
                                        content: "Add your content here",
                                        backgroundImageDescription: "presentation",
                                        spokenNarration: "This is a new slide",
                                    },
                                ]);
                                setCurrentSlideIndex(slides.length);
                            }}
                            className="flex items-center gap-2"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Add Slide
                        </ActionButton>
                    </div>
                </div>

                <div className="mt-4 text-sm text-gray-500">
                    Slide {currentSlideIndex + 1} of {slides.length}
                </div>
            </div>
        </div>
    );
};