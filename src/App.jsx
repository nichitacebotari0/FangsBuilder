import Hero from './Components/Hero';

function App() {
  return (
    <div class="flex flex-wrap bg-sky-900">

      <div class="flex-auto basis-10/12 bg-black pb-96">
        <Hero path='/Heroes/Astrada/' />
      </div>

      <div class="block basis-2/12"></div>
    </div>
  );
}

export default App;