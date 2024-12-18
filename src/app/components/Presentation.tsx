import React, { useState } from 'react';
import { useCopilotContext } from '@copilotkit/react-core';
import Slide from './Slide';

const Presentation: React.FC = () => {
    const { copilot } = useCopilotContext();
    const [slides, setSlides] = useState([{ title: 'Slide 1', content: 'Content of slide 1' }]);

    const addSlide = () => {
        setSlides([...slides, { title: '', content: '' }]);
    };

    return (
        <div>
            <h1>Presentation</h1>
            {slides.map((slide, index) => (
                <Slide key={index} slide={slide} />
            ))}
            <button onClick={addSlide}>Add Slide</button>
        </div>
    );
};

export default Presentation;