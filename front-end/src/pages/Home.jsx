import BloodAvailability from "../components/Layout/BloodAvailability";
import Featured from "../components/Layout/Featured";
import Hero from "../components/Layout/Hero";
import HowItWorks from "../components/Layout/HowItWorks";
import ImpactStats from "../components/Layout/ImpactStats";
import UpcomingCamps from "../components/Layout/UpcomingCamps";


const Home = () => {
  return (
    <>
      <Hero />
      <Featured/>
      <BloodAvailability/>
      <HowItWorks/>
      <UpcomingCamps/>
      <ImpactStats/>
    </>
  );
};

export default Home;
