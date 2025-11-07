import React, { useState, useEffect } from 'react';
import { LightbulbIcon } from './Icons';

const facts = [
    "Recycling one aluminum can saves enough energy to run a TV for three hours.",
    "The U.S. produces enough plastic film each year to shrink-wrap the state of Texas.",
    "Around 8 million metric tons of plastic are thrown into the ocean annually.",
    "Glass is 100% recyclable and can be recycled endlessly without loss in quality or purity.",
    "Composting can reduce household waste by up to 30%.",
    "Paper can be recycled 5-7 times before the fibers become too short.",
    "Every ton of recycled paper saves about 17 trees."
];

const FunFact: React.FC = () => {
    const [fact, setFact] = useState<string>('');

    useEffect(() => {
        setFact(facts[Math.floor(Math.random() * facts.length)]);
    }, []);

    return (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 text-yellow-800 dark:text-yellow-300 p-4 rounded-r-lg" role="alert">
            <div className="flex items-start gap-3">
                <LightbulbIcon />
                <div>
                    <p className="font-bold">Did you know?</p>
                    <p>{fact}</p>
                </div>
            </div>
        </div>
    );
};

export default FunFact;
