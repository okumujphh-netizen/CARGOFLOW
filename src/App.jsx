
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-lg">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            CargoFlow
          </h1>

          <p className="text-gray-600 text-lg">
            Smart Shipping & Container Management Platform
          </p>

          <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition">
            Get Started
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
