'use client'


export default function PricingPlans() {
    const plans = [
        { name: 'Basic', price: 50, features: ['Up to 5kg', 'Local Delivery', 'Standard Tracking'], highlighted: false },
        { name: 'Standard', price: 250, features: ['Up to 20kg', 'Nationwide', 'Live Tracking', 'Insurance'], highlighted: true },
        { name: 'Premium', price: 150, features: ['Up to 10kg', 'International', 'Express Service'], highlighted: false },
    ];
    return (
        <section className="py-16 sm:py-24">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">PRICING & PLANS</h2>
                <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                    {plans.map(plan => (
                        <div key={plan.name} className={`rounded-lg p-8 shadow-lg transition-transform ${plan.highlighted ? 'border-2 border-yellow-500 bg-white scale-105 dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}`}>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{plan.name}</h3>
                            <p className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">${plan.price}</p>
                            <ul className="mt-6 space-y-3 text-gray-600 dark:text-gray-400">
                                {plan.features.map(f => <li key={f}>{f}</li>)}
                            </ul>
                            <button className={`mt-8 w-full rounded-md py-3 font-semibold ${plan.highlighted ? 'bg-yellow-500 text-slate-900' : 'bg-white ring-1 ring-inset ring-gray-300 dark:bg-gray-600 dark:text-white'}`}>
                                GET STARTED
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}