import { Routes, Route, A, useParams } from '@solidjs/router';
import { createSignal, For } from 'solid-js';
import CroppedImage from './Components/CroppedImage';
import Hero from './Components/Hero';
import testComponent from './Components/testcomponent';

const heroes = await (await fetch("/Heroes/Info.json")).json()
function App() {
  const [chosenHero, setChosenHero] = createSignal('')

  return (
    <div class="flex flex-nowrap flex-col bg-sky-900">
      <div class="flex flex-row flex-wrap">
        <For each={heroes}>
          {item =>
            <A class="basis-1/12 mt-1 -ml-10 sm:-ml-0" noScroll={true} replace={true} href={"/Heroes/" + item + "/"} onClick={() => setChosenHero(item)}>
              <CroppedImage
                imgbg="bg-black"
                image={"/Heroes/" + item + "/icon.png"}
                bg="bg-sky-800"
                borderSize="40" minWidth="130" maxWidth="130"
                imageSize="38" imageH="60%" imageV="55%" />
            </A>}
        </For>
      </div>
      <div class="bg-black h-auto">
        <Routes>

          {/* <Route path={"/Heroes/:Hero/"} component={testComponent}></Route> */}
          <Route path={"/Heroes/:Hero/"} component={Hero}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;