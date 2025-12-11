import React, { useState } from 'react';

interface TutorialProps {
    onComplete: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);

    const steps = [
        { title: "WELCOME SUBJECT 41", body: "You have accessed the Neo Tokyo Data Network. Your goal is to decrypt data packets (type words) before the link stability (timer) reaches zero." },
        { title: "COMBAT MECHANICS", body: "Typing correctly builds HEAT (Combo) and boosts earnings. Mistakes damage the link and reset heat. Watch out for BOSS nodes which use HEX code and drain time faster." },
        { title: "ECONOMY", body: "Earn YEN to buy Software (Consumables), Hardware (Passive Buffs), and Themes. When you max out your rig, you can REBOOT for permanent status." },
        { title: "CONTROLS", body: "Use number keys [1] [2] for items. Use [~] for the Command Line Interface. Good luck." }
    ];

    const next = () => {
        if (step < steps.length - 1) setStep(s => s + 1);
        else onComplete();
    };

    return (
        <div className="absolute inset-0 z-[60] bg-black/90 flex items-center justify-center p-6">
            <div className="max-w-md w-full border border-accent bg-black p-6 relative shadow-[0_0_30px_rgba(225,33,32,0.3)]">
                <h2 className="text-xl font-header text-accent mb-4">{steps[step].title}</h2>
                <p className="font-ui text-sm text-gray-300 mb-8 leading-relaxed">
                    {steps[step].body}
                </p>
                <div className="flex justify-between items-center">
                    <div className="flex gap-1">
                        {steps.map((_, i) => (
                            <div key={i} className={`h-1 w-4 ${i === step ? 'bg-accent' : 'bg-gray-800'}`} />
                        ))}
                    </div>
                    <button onClick={next} className="btn-cyber px-6 py-2 text-white">
                        {step === steps.length - 1 ? "INITIALIZE" : "NEXT >>"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Tutorial;