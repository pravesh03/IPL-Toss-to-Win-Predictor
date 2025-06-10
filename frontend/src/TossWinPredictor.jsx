import React, { useState } from 'react';
import axios from 'axios';

function TossWinPredictor() {
const [formData, setFormData] = useState({
team1: '',
team2: '',
toss_winner: '',
toss_decision: '',
city: ''
});

const [result, setResult] = useState('');
const [loading, setLoading] = useState(false);

const teams = [
'Mumbai Indians', 'Delhi Capitals', 'Chennai Super Kings',
'Kolkata Knight Riders', 'Rajasthan Royals', 'Royal Challengers Bangalore',
'Sunrisers Hyderabad', 'Lucknow Super Giants', 'Gujarat Titans', 'Punjab Kings'
];

const cities = ['Mumbai', 'Delhi', 'Chennai', 'Kolkata', 'Hyderabad', 'Ahmedabad', 'Bangalore', 'Jaipur', 'Pune'];
const tossDecisions = ['bat', 'field'];

const handleChange = (e) => {
setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
e.preventDefault();
const { team1, team2, toss_winner, toss_decision, city } = formData;

if (!team1 || !team2 || !toss_winner || !toss_decision || !city) {
  setResult("Please fill out all fields.");
  return;
}

if (team1 === team2) {
  setResult("Team 1 and Team 2 must be different.");
  return;
}

if (toss_winner !== team1 && toss_winner !== team2) {
  setResult("Toss winner must be one of the playing teams.");
  return;
}

try {
  setLoading(true);
  setResult('');
  const response = await axios.post('http://localhost:5002/predict', formData);
  setResult(response.data.result);
} catch (error) {
  console.error('Error fetching prediction:', error);
  setResult('Error fetching prediction. Please try again.');
} finally {
  setLoading(false);
}
};

return (
<div className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center relative"
     style={{ backgroundImage: "url('/stadium.png')" }}>
{/* Overlay */}
<div className="absolute inset-0 bg-black bg-opacity-60 z-0" />

{/* Scrolling ticker */}
<div className="w-full z-10 bg-gradient-to-r from-blue-800 via-indigo-700 to-purple-700 text-white text-sm py-2 px-4 font-semibold">
  <marquee behavior="scroll" direction="left" scrollamount="5">
    🏏 Live: RCB vs MI toss update • CSK won toss, chose to bat • GT vs RR tomorrow • Predictions powered by ML • Explore team matchups below ⏱️
  </marquee>
</div>

{/* Main Card */}
<div className="relative z-10 mt-8 max-w-2xl w-full p-8 bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-2xl text-white">
  <h1 className="text-4xl font-extrabold text-center mb-6">
    🏏 IPL Toss-to-Win Predictor
  </h1>

  <form onSubmit={handleSubmit} className="space-y-5">
    {/* Team 1 */}
    <div>
      <label className="block mb-1 font-medium">Team 1</label>
      <select
        name="team1"
        value={formData.team1}
        onChange={handleChange}
        className="w-full p-2 bg-white/20 border border-white/30 rounded-md text-white"
        required
      >
        <option value="">Select team1</option>
        {teams.map((team, idx) => (
          <option key={idx} value={team}>{team}</option>
        ))}
      </select>
    </div>

    {/* Team 2 */}
    <div>
      <label className="block mb-1 font-medium">Team 2</label>
      <select
        name="team2"
        value={formData.team2}
        onChange={handleChange}
        className="w-full p-2 bg-white/20 border border-white/30 rounded-md text-white"
        required
      >
        <option value="">Select team2</option>
        {teams.filter(t => t !== formData.team1).map((team, idx) => (
          <option key={idx} value={team}>{team}</option>
        ))}
      </select>
    </div>

    {/* Toss Winner */}
    <div>
      <label className="block mb-1 font-medium">Toss Winner</label>
      <select
        name="toss_winner"
        value={formData.toss_winner}
        onChange={handleChange}
        className="w-full p-2 bg-white/20 border border-white/30 rounded-md text-white"
        required
      >
        <option value="">Select Toss Winner</option>
        {[formData.team1, formData.team2]
          .filter(team => team && team !== '')
          .map((team, idx) => (
            <option key={idx} value={team}>{team}</option>
          ))}
      </select>
    </div>

    {/* Toss Decision */}
    <div>
      <label className="block mb-1 font-medium">Toss Decision</label>
      <select
        name="toss_decision"
        value={formData.toss_decision}
        onChange={handleChange}
        className="w-full p-2 bg-white/20 border border-white/30 rounded-md text-white"
        required
      >
        <option value="">Select toss decision</option>
        {tossDecisions.map((decision, idx) => (
          <option key={idx} value={decision}>{decision}</option>
        ))}
      </select>
    </div>

    {/* City */}
    <div>
      <label className="block mb-1 font-medium">City</label>
      <select
        name="city"
        value={formData.city}
        onChange={handleChange}
        className="w-full p-2 bg-white/20 border border-white/30 rounded-md text-white"
        required
      >
        <option value="">Select city</option>
        {cities.map((city, idx) => (
          <option key={idx} value={city}>{city}</option>
        ))}
      </select>
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      disabled={
        !formData.team1 ||
        !formData.team2 ||
        !formData.toss_winner ||
        !formData.toss_decision ||
        !formData.city ||
        formData.team1 === formData.team2 ||
        !(formData.toss_winner === formData.team1 || formData.toss_winner === formData.team2)
      }
      className={`w-full py-3 rounded-md font-semibold transition duration-300 ${
        !formData.team1 ||
        !formData.team2 ||
        !formData.toss_winner ||
        !formData.toss_decision ||
        !formData.city ||
        formData.team1 === formData.team2
          ? 'bg-gray-500 cursor-not-allowed text-gray-300'
          : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white'
      }`}
    >
      {loading ? 'Predicting...' : 'Predict'}
    </button>
  </form>

  {/* Result */}
  {result && (
    <div className="mt-6 text-center text-lg font-semibold text-yellow-300 bg-black bg-opacity-40 p-4 rounded-md shadow-inner">
      {result}
    </div>
  )}
</div>
</div>
);
}

export default TossWinPredictor;