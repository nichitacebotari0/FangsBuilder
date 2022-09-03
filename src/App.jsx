import Hero from './Components/Hero';

function App() {
  return (
    <div class="flex flex-wrap bg-sky-900">
      <div class="hidden md:block basis-1/12"></div>

      <div class="flex-auto basis-12/12 lg:basis-3/4 bg-black">
       <Hero path='/Heroes/Astrada/'/>
      </div>
      
      <div class="hidden md:block basis-1/12"></div>
    </div>
  );
}

export default App;