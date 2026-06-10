import React from 'react';
import { Star, Quote } from 'lucide-react';
import { CLIENT_REVIEWS } from '../plansData';

export default function ReviewsSection() {
  return (
    <section className="py-20 lg:py-24 bg-[#0A0A0A] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header content */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <span className="font-mono text-[10px] font-bold tracking-widest text-yellow-400 uppercase rounded bg-yellow-400/10 px-3 py-1">
            Community Endorsements
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-black italic uppercase leading-none tracking-tighter text-white">
            Trusted by Power Users globally
          </h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">
            From heavy plugin load-outs to million-member bot routers, see what active webmaster admins say about VxHost hardware reliability.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CLIENT_REVIEWS.map((review, index) => (
            <div
              key={review.name}
              className="rounded-2xl border border-white/5 bg-white/5 p-6 flex flex-col justify-between relative group hover:border-yellow-400/20 transition-all duration-300"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-white/5 pointer-events-none group-hover:text-yellow-400/5 transition-colors" />
              
              {/* Review Comment */}
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-zinc-300 text-sm italic leading-relaxed font-sans">
                  "{review.comment}"
                </p>
              </div>

              {/* Reviewer Meta info */}
              <div className="flex items-center gap-3.5 mt-8 border-t border-white/5 pt-4">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="h-10 w-10 rounded-full border border-white/10 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-sm font-bold text-white font-display leading-tight">{review.name}</h4>
                  <p className="text-[11px] text-zinc-500 font-mono mt-1 leading-none">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
