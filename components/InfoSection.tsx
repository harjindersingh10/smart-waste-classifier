import React, { useState, ReactNode } from 'react';
import { ChevronDownIcon, ChevronUpIcon, CodeIcon, GoalIcon, HowIcon, InfoIconSolid, WhyIcon } from './Icons';

interface CollapsibleSectionProps {
    title: string;
    children: ReactNode;
    icon: ReactNode;
    defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children, icon, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg mb-4 bg-white dark:bg-dark-card">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left font-semibold text-brand-dark dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-opacity-50 rounded-lg"
                aria-expanded={isOpen}
            >
                <span className="flex items-center gap-3">
                    {icon}
                    <span className="text-lg">{title}</span>
                </span>
                {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </button>
            {isOpen && (
                <div className="p-4 pt-0 text-brand-secondary dark:text-dark-text-secondary">
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

const categories = [
    {
        name: 'Plastic',
        description: 'Synthetic, non-biodegradable material used in packaging and products.',
        examples: 'Bottles, wrappers, containers',
        tip: 'Rinse before recycling. Avoid burning; use plastic recycling bins.'
    },
    {
        name: 'Paper',
        description: 'Biodegradable material made from cellulose fibers.',
        examples: 'Newspapers, notebooks, cardboard',
        tip: 'Keep dry; place in paper recycling bin.'
    },
    {
        name: 'Metal',
        description: 'Recyclable material used in cans, tins, and tools.',
        examples: 'Soda cans, foil, metal caps',
        tip: 'Rinse before recycling; deposit in metal recycling units.'
    },
    {
        name: 'Organic',
        description: 'Biodegradable waste from food or plants.',
        examples: 'Fruit peels, leftovers, leaves',
        tip: 'Compost or use organic waste bins. Do not mix with plastic or metal.'
    }
];

const InfoSection: React.FC = () => {
    return (
        <div className="bg-gray-50 dark:bg-dark-bg/50 rounded-2xl p-6 sm:p-8 mt-8 border border-gray-200 dark:border-gray-700">
            <div className="grid md:grid-cols-3 gap-6 mb-8 text-center md:text-left">
                <div className="flex flex-col items-center md:items-start">
                    <WhyIcon />
                    <h3 className="text-xl font-bold mt-4 mb-2 text-brand-dark dark:text-dark-text">Why this matters</h3>
                    <p className="text-brand-secondary dark:text-dark-text-secondary">Waste segregation at source is one of the simplest yet most effective ways to protect the environment. By correctly identifying waste, you can help reduce pollution, improve recycling efficiency, and support sustainable living.</p>
                </div>
                <div className="flex flex-col items-center md:items-start">
                    <HowIcon />
                    <h3 className="text-xl font-bold mt-4 mb-2 text-brand-dark dark:text-dark-text">How it works</h3>
                    <ul className="list-none text-brand-secondary dark:text-dark-text-secondary space-y-1">
                        <li><strong>1. Upload:</strong> Select an image of any waste item.</li>
                        <li><strong>2. Analyze:</strong> Our AI model analyzes the image.</li>
                        <li><strong>3. Classify:</strong> It predicts the waste type and provides a disposal tip.</li>
                    </ul>
                </div>
                <div className="flex flex-col items-center md:items-start">
                    <GoalIcon />
                    <h3 className="text-xl font-bold mt-4 mb-2 text-brand-dark dark:text-dark-text">Our Goal</h3>
                    <p className="text-brand-secondary dark:text-dark-text-secondary">To create awareness and assist individuals in practicing responsible waste management using AI technology.</p>
                </div>
            </div>

            <CollapsibleSection title="Category Explanations" icon={<InfoIconSolid />} defaultOpen={true}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 uppercase">
                            <tr>
                                <th scope="col" className="px-4 py-3">Category</th>
                                <th scope="col" className="px-4 py-3">Description</th>
                                <th scope="col" className="px-4 py-3">Common Examples</th>
                                <th scope="col" className="px-4 py-3">Disposal Tip</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat, index) => (
                                <tr key={cat.name} className={`border-b dark:border-gray-700 ${index % 2 === 0 ? 'bg-white dark:bg-dark-card' : 'bg-gray-50 dark:bg-gray-800'}`}>
                                    <th scope="row" className="px-4 py-4 font-bold text-gray-900 dark:text-white whitespace-nowrap">{cat.name}</th>
                                    <td className="px-4 py-4 text-gray-700 dark:text-dark-text-secondary">{cat.description}</td>
                                    <td className="px-4 py-4 text-gray-700 dark:text-dark-text-secondary">{cat.examples}</td>
                                    <td className="px-4 py-4 text-gray-700 dark:text-dark-text-secondary">{cat.tip}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="About the Project" icon={<CodeIcon />}>
                <div className="space-y-2">
                    <p>This project uses a deep learning model to perform image classification on waste images. It’s designed as a mini AI system for sustainability education and awareness.</p>
                    <p>The app is built using modern web technologies, and the AI classification is powered by Google's Gemini model.</p>
                    <p>The goal is to demonstrate how AI can contribute to environmental protection through intelligent automation.</p>
                </div>
            </CollapsibleSection>
        </div>
    );
};

export default InfoSection;
