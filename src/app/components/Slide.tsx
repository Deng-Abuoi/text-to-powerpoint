"use client";

import { useCopilotAction } from "@copilotkit/react-core";

// Define an interface for the model of a slide
export interface SlideModel {
    title: string;
    content: string;
    backgroundImageDescription: string;
    spokenNarration: string;
}

// Define an interface for the slide component props
export interface SlideProps {
    slide: SlideModel;
    partialUpdateSlide: (partialSlide: Partial<SlideModel>) => void;
}

// Define the Slide component
export const Slide = (props: SlideProps) => {
    // Define height for speaker notes
    const heightOfSpeakerNotes = 150;

    // Set up copilot action for updating the slide
    useCopilotAction({
        name: "updateSlide",
        description: "Update the current slide.",
        parameters: [
            {
                name: "title",
                type: "string",
                description: "The title of the slide. Should be a few words long.",
                required: true,
            },
            {
                name: "content",
                type: "string",
                description: "The content of the slide. Should generally consists of a few bullet points.",
                required: true,
            },
            {
                name: "backgroundImageDescription",
                type: "string",
                description: "What to display in the background of the slide. For example, 'dog', 'house', etc.",
                required: true,
            },
            {
                name: "spokenNarration",
                type: "string",
                description: "The spoken narration for the slide. This is what the user will hear when the slide is shown.",
                required: true,
            }
        ],
        handler: ({ title, content, backgroundImageDescription, spokenNarration }) => {
            props.partialUpdateSlide({
                title,
                content,
                backgroundImageDescription,
                spokenNarration
            });
        }
    }, [props.partialUpdateSlide]);

    // Construct background image URL
    const backgroundImage = 'url("https://source.unsplash.com/featured/?' + 
        encodeURIComponent(props.slide.backgroundImageDescription) + '")';

    return (
        <>
            {/* Slide content container */}
            <div 
                className="w-full relative bg-slate-200"
                style={{
                    height: `calc(100vh - ${heightOfSpeakerNotes}px)`,
                }}
            >
                {/* Title container */}
                <div className="h-1/5 flex items-center justify-center text-5xl text-white text-center z-10">
                    <textarea
                        className="text-2xl bg-transparent text-black p-4 text-center font-bold uppercase italic line-clamp-2 resize-none flex items-center"
                        style={{
                            border: "none",
                            outline: "none",
                        }}
                        value={props.slide.title}
                        placeholder="Title"
                        onChange={(e) => {
                            props.partialUpdateSlide({ title: e.target.value });
                        }}
                    />
                </div>

                {/* Content container with background */}
                <div 
                    className="h-4/5 flex"
                    style={{
                        backgroundImage,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <textarea
                        className="w-full text-3xl text-black font-medium p-10 resize-none bg-red mx-40 my-8 rounded-xl text-center"
                        style={{
                            lineHeight: "1.5",
                        }}
                        value={props.slide.content}
                        placeholder="Body"
                        onChange={(e) => {
                            props.partialUpdateSlide({ content: e.target.value });
                        }}
                    />
                </div>
            </div>

            {/* Speaker notes */}
            <textarea
                className="w-9/12 h-full bg-transparent text-5xl p-10 resize-none bg-gray-500 pr-36"
                style={{
                    height: `${heightOfSpeakerNotes}px`,
                    background: "none",
                    border: "none",
                    outline: "none",
                    fontFamily: "inherit",
                    fontSize: "inherit",
                    lineHeight: "inherit",
                }}
                value={props.slide.spokenNarration}
                onChange={(e) => {
                    props.partialUpdateSlide({ spokenNarration: e.target.value });
                }}
            />
        </>
    );
};