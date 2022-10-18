import { createSignal, For } from 'solid-js';
import CroppedImage from './Components/CroppedImage';
import Hero from './Components/Hero';

const heroes = await (await fetch("/Heroes/Info.json")).json()
function App() {
  const [chosenHero, setChosenHero] = createSignal('')

  return (
    <div class="flex flex-nowrap flex-col-reverse bg-sky-900">

      <div class="bg-black h-screen">
        <Hero path={'/Heroes/' +chosenHero()+"/"}/>
      </div>
      <div class="">
        <div class="flex flex-row flex-wrap">
          <For each={heroes}>
            {item =>
              <div class="basis-1/12 mt-1 -ml-10 sm:-ml-0" onClick={()=> setChosenHero(item)}>
                <CroppedImage
                  imgbg="bg-black"
                  image={"/Heroes/" + item + "/icon.png"}
                  bg="bg-sky-800"
                  borderSize="40" minWidth="130" maxWidth="130"
                  imageSize="38" imageH="60%" imageV="55%" />
              </div>}
          </For>
        </div>
      </div>
    </div>
  );
}

export default App;