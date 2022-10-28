import { Routes, Route, A, useParams, useSearchParams } from '@solidjs/router';
import { For } from 'solid-js';
import Hero from './Components/Hero';

const heroes = await (await fetch("/Heroes/Info.json")).json()
function App() {
  const params = useParams();
  return (
    <div class="flex flex-nowrap flex-col bg-sky-900">
      <div class="flex flex-row flex-wrap lg:ml-10 md:ml-8 sm:ml-6 ml-10 mb-2 mt-2">
        <For each={heroes}>
          {item =>
            <A class="lg:basis-1/12 sm:basis-1/6 basis-auto mt-1 lg:-ml-10 md:-ml-8 sm:-ml-6 -ml-10" noScroll={true} replace={true} href={"/Heroes/" + item + "/"}
              onClick={() => { }}>
              <div class={"clip-hero-container relative active:bg-sky-100 bg-sky-900"}>
                <img class="clip-hero-image bg-black"
                  src={"/Heroes/" + item + "/icon.png"} />
              </div>
            </A>}
        </For>
      </div>
      <div class="bg-black min-h-screen h-auto">
        <Routes>
          <Route path={"/Heroes/:Hero"} component={Hero}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;