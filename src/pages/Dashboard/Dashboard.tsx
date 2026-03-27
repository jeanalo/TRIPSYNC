import { useTravel } from '../../context/TravelContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, tripDetails, expenses, experiences } = useTravel();

  const totalSpent = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const remainingBudget = (Number(tripDetails.budget) || 0) - totalSpent;
  const budgetProgress = tripDetails.budget
    ? (totalSpent / Number(tripDetails.budget)) * 100
    : 0;
  const savedExperiences = experiences.filter((exp) => exp.saved);

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Welcome back, {user?.name || 'Traveler'}
        </h1>
        <p className="text-foreground/70">
          Here's what's happening with your trip to{' '}
          {tripDetails.destinationCountry || 'your next destination'}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Trip Summary Card */}
        <div className="bg-card p-6 rounded-3xl shadow-lg border border-border/10 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary/20 rounded-2xl text-primary">✈️</div>
            {tripDetails.departureDate && (
              <span className="text-xs font-bold px-3 py-1 bg-secondary/20 text-secondary rounded-full">
                Upcoming
              </span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-card-foreground mb-1">
              {tripDetails.destinationCountry
                ? `Trip to ${tripDetails.destinationCountry}`
                : 'Plan a Trip'}
            </h3>
            <p className="text-sm text-card-foreground/60 mb-4">
              {tripDetails.departureDate
                ? `Departing on ${new Date(tripDetails.departureDate).toLocaleDateString()}`
                : 'No trip scheduled'}
            </p>
            <Link
              to="/app/setup"
              className="text-sm font-semibold text-primary hover:text-primary/80"
            >
              {tripDetails.destinationCountry ? 'Edit Details →' : 'Start Planning →'}
            </Link>
          </div>
        </div>

        {/* Jet Lag Card */}
        <div className="bg-card p-6 rounded-3xl shadow-lg border border-border/10 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">🌙</div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-card-foreground mb-1">
              Jet Lag Assistant
            </h3>
            <p className="text-sm text-card-foreground/60 mb-4">
              Adjust your sleep schedule before you fly.
            </p>
            <Link
              to="/app/jet-lag"
              className="text-sm font-semibold text-indigo-400 hover:text-indigo-300"
            >
              View Plan →
            </Link>
          </div>
        </div>

        {/* Budget Card */}
        <div className="bg-card p-6 rounded-3xl shadow-lg border border-border/10 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-500">💰</div>
            <span className="text-sm font-bold text-card-foreground">
              ${remainingBudget.toFixed(0)} left
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-card-foreground mb-2">Budget</h3>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${Math.min(budgetProgress, 100)}%` }}
              />
            </div>
            <Link
              to="/app/budget"
              className="text-sm font-semibold text-emerald-500 hover:text-emerald-400"
            >
              Manage Budget →
            </Link>
          </div>
        </div>

        {/* Saved Experiences Card */}
        <div className="bg-card p-6 rounded-3xl shadow-lg border border-border/10 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-500">🗺️</div>
            <span className="text-sm font-bold text-card-foreground">
              {savedExperiences.length} Saved
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-card-foreground mb-1">Experiences</h3>
            <p className="text-sm text-card-foreground/60 mb-4">
              Explore activities and free tours.
            </p>
            <Link
              to="/app/experiences"
              className="text-sm font-semibold text-amber-500 hover:text-amber-400"
            >
              Discover More →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card rounded-3xl p-8 shadow-lg border border-border/10">
          <h2 className="text-xl font-bold text-card-foreground mb-6">🕐 Travel Tips</h2>
          <div className="space-y-4">
            <div className="p-4 bg-background/50 rounded-2xl border border-border/10">
              <h4 className="font-bold text-foreground mb-1">Hydrate Often</h4>
              <p className="text-sm text-foreground/70">
                Drink plenty of water during your flight to reduce jet lag symptoms.
              </p>
            </div>
            <div className="p-4 bg-background/50 rounded-2xl border border-border/10">
              <h4 className="font-bold text-foreground mb-1">Local Currency</h4>
              <p className="text-sm text-foreground/70">
                Exchange a small amount of cash before you leave the airport.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-3xl p-8 shadow-lg border border-border/10">
          <h2 className="text-xl font-bold text-card-foreground mb-6">
            🐷 Budget Status
          </h2>
          <div className="flex items-center justify-between mb-4">
            <span className="text-card-foreground/70">Total Budget</span>
            <span className="font-bold text-card-foreground">
              ${tripDetails.budget || 0}
            </span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-card-foreground/70">Spent so far</span>
            <span className="font-bold text-red-400">-${totalSpent}</span>
          </div>
          <div className="pt-4 border-t border-border/10 flex items-center justify-between">
            <span className="font-bold text-card-foreground">Remaining</span>
            <span className="font-bold text-green-500 text-xl">${remainingBudget}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
