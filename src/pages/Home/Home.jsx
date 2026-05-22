import { useEffect } from "react";
import Banner from "./Banner";
import TrendingIdeas from "./TrendingIdeas";
import HowItWorks from "./HowItWorks";
import JoinCommunity from "./JoinCommunity";

const Home = () => {
  useEffect(() => {
    document.title = "IdeaVault – Share & Discover Startup Ideas";
  }, []);


  
  return (
    <div>
      <Banner />
      <TrendingIdeas />
      <HowItWorks />
      <JoinCommunity />
    </div>
  );
};

export default Home;