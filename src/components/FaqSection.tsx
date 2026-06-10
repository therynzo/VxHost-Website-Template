import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { FAQS } from '../plansData';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 lg:py-24 bg-[#0A0A0A] border-t border-white/5 relative">
      <div className="absolute bottom-20 right-20 -z-10 h-[300px] w-[300px] rounded-full bg-yellow-400/[0.01] blur-[100px]" />
      
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center space-y-4 mb-16">
          <span className="font-mono text-[10px] font-bold tracking-widest text-yellow-400 uppercase rounded bg-yellow-400/10 px-3 py-1">
            FAQ support
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-black italic uppercase leading-none tracking-tighter text-white">
            Help Center
          </h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Everything you need to know about setting up your gaming platform or Cloud VPS on VxHost nodes.
          </p>
        </div>

        {/* FAQ Accordion container */}
        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className="rounded-xl border border-white/5 bg-white/5 hover:border-yellow-400/20 transition-all duration-300 overflow-hidden"
              >
                {/* Trigger button */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left transition-colors font-sans cursor-pointer group"
                >
                  <div className="flex items-center gap-3 pr-4">
                    <HelpCircle className={`h-5 w-5 shrink-0 transition-colors ${
                      isOpen ? 'text-yellow-400' : 'text-zinc-500 group-hover:text-yellow-400'
                    }`} />
                    <span className="font-display font-bold text-white group-hover:text-yellow-400 text-sm sm:text-base leading-snug">
                      {faq.question}
                    </span>
                  </div>
                  
                  {/* Plus/minus icons with transition */}
                  <div className={`p-1 rounded-lg border transition-all shrink-0 ${
                    isOpen 
                      ? 'bg-yellow-400 border-yellow-400 text-black' 
                      : 'border-white/10 text-zinc-400 group-hover:border-yellow-400/40'
                  }`}>
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </div>
                </button>

                {/* Question Details */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 pt-1 border-t border-white/5 text-sm leading-relaxed text-zinc-400 font-sans">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
