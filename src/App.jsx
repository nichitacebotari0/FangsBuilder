import { createSignal, For } from 'solid-js';
import CroppedImage from './Components/CroppedImage';
import Hero from './Components/Hero';

const heroes = await (await fetch("/Heroes/Info.json")).json()
function App() {
  const [chosenHero, setChosenHero] = createSignal('')

  return (
    <div class="flex flex-nowrap flex-row bg-sky-900">

      <div class="basis-10/12 bg-black pb-96">
        <Hero path={'/Heroes/' +chosenHero()+"/"}/>
      </div>
      <div class="basis-1/6">
        <div class="flex flex-row flex-wrap">
          <For each={heroes}>
            {item =>
              <div class="basis-1/2" onClick={()=> setChosenHero(item)}>
                <CroppedImage
                  imgbg="bg-black"
                  image={"/Heroes/" + item + "/icon.png"}
                  bg="bg-sky-800"
                  borderSize="38" minWidth="130" maxWidth="130"
                  imageSize="36" imageH="62%" imageV="55%" />
              </div>}
          </For>
        </div>
      </div>
    </div>
  );
}

export default App;