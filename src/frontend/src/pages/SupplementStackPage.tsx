import React from 'react';
import SupplementStackOptimizer from '../components/supplement/SupplementStackOptimizer';

export default function SupplementStackPage() {
  return (
    <div className="container py-8">
      <div className="mb-8 border-b-4 border-secondary pb-4">
        <div className="flex items-center gap-4">
          <img
            src="/assets/generated/supplement-bottle.dim_256x256.png"
            alt="Supplements"
            className="h-20 w-20 drop-shadow-[0_0_20px_rgba(0,212,255,0.5)]"
          />
          <div>
            <h1 className="mb-2 text-5xl font-black uppercase tracking-tighter text-secondary">
              SUPPLEMENT STACK OPTIMIZER
            </h1>
            <p className="text-xl font-bold text-muted-foreground">
              Curated supplement bundles based on your specific fitness goals
            </p>
          </div>
        </div>
      </div>

      <SupplementStackOptimizer />
    </div>
  );
}
