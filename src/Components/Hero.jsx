import { createEffect, createResource, createSignal, For, Match, Show, Switch } from "solid-js";
import AugmentCategory from "./AugmentCategory";
import AugmentDescription from "./AugmentDescription";
import CroppedImage from "./CroppedImage";
import FlexPicker from "./FlexPicker";

async function fetcher(path, { value, refetching }) {
    let result = (await fetch(path));
    return await result.json();
}

const augmentSlots = [
    { type: "POSITIONAL", value: null },
    { type: "RED", value: null },
    { type: "YELLOW", value: null },
    { type: "FLEX", value: null },
    { type: "ULT", value: null },
    { type: "ACTIVE", value: null },
    { type: "FLEX", value: null },
    { type: "FLEX", value: null }
]

function getColor(type) {
    switch (type) {
        case "RED":
            return "bg-red-800";
        case "YELLOW":
            return "bg-yellow-800";
        case "POSITIONAL":
            return "bg-sky-700";
    }
}

const positional = await (await fetch("/POSITIONAL/Info.json")).json()
const actives = await (await fetch("/ACTIVE/Info.json")).json()
function Hero(props) {
    const [data, { mutate, refetch }] = createResource(() => (props.path + 'HeroInfo.json'), fetcher);
    const [slots, setSlots] = createSignal(augmentSlots, { equals: false });
    const [selectedSlot, setSelectedSlot] = createSignal(0, { equals: false });
    return (
        <div class=" text-sky-50">
            <Show when={!data.loading}>
                <div class="flex flex-col justify-center mt-2 mb-2 p-2">
                    <div class="basis-10/12 text-center">
                        <CroppedImage
                            imgbg="bg-black"
                            image={props.path + data().IconName}
                            bg="bg-sky-800"
                            borderSize="42"
                            imageSize="38" imageH="60%" imageV="55%" />
                    </div>
                    <div class="basis-2/12 text-center border-b-blue-800 border-b-2">{data().Name}</div>
                </div>

                <div class="flex flex-wrap items-center justify-center mb-2 border-b-2 ml-2 mr-2 border-b-blue-800" >
                    <div class="basis-40" onClick={() => setSelectedSlot(0)} >
                        <Show when={slots()[0].value} fallback={<CroppedImage
                            imgbg="bg-black"
                            bg="bg-sky-700"
                            image="Empty.png"
                            borderSize="32" maxWidth="130" minWidth="130"
                            imageSize="26" imageH="55%" imageV="45%" />}>
                            <CroppedImage
                                imgbg="bg-black"
                                bg="bg-sky-700"
                                image={slots()[0].value}
                                borderSize="42" maxWidth="130" minWidth="130"
                                imageSize="38" imageH="55%" imageV="45%" />
                        </Show>
                    </div>
                    <div class="basis-40" onClick={() => setSelectedSlot(1)} >
                        <Show when={slots()[1].value} fallback={<CroppedImage
                            imgbg="bg-black"
                            bg="bg-red-800"
                            image="Empty.png"
                            borderSize="32" maxWidth="130" minWidth="130"
                            imageSize="26" imageH="55%" imageV="45%" />}>
                            <CroppedImage
                                imgbg="bg-black"
                                bg="bg-red-800"
                                image={slots()[1].value}
                                borderSize="42" maxWidth="130" minWidth="130"
                                imageSize="38" imageH="55%" imageV="45%" />
                        </Show>
                    </div>

                    <div class="basis-40" onClick={() => setSelectedSlot(2)}>
                        <Show when={slots()[2].value} fallback={<CroppedImage
                            imgbg="bg-black"
                            bg="bg-yellow-600"
                            image="Empty.png"
                            borderSize="32" maxWidth="130" minWidth="130"
                            imageSize="26" imageH="55%" imageV="45%" />}>
                            <CroppedImage
                                imgbg="bg-black"
                                bg="bg-yellow-600"
                                image={slots()[2].value}
                                borderSize="42" maxWidth="130" minWidth="130"
                                imageSize="38" imageH="55%" imageV="45%" />
                        </Show>
                    </div>
                    <button class="basis-40 flexAugment" >
                        <Show when={slots()[3].value} fallback={<CroppedImage
                            imgbg="bg-black"
                            bg="bg-stone-500"
                            image="Empty.png"
                            borderSize="32" maxWidth="130" minWidth="130"
                            imageSize="26" imageH="55%" imageV="45%" />}>
                            <CroppedImage
                                imgbg="bg-black"
                                bg={getColor(slots()[3].type)}
                                image={slots()[3].value}
                                borderSize="42" maxWidth="130" minWidth="130"
                                imageSize="38" imageH="55%" imageV="45%" />
                        </Show>
                        <div class="text-white flexAugment-picker">
                            <FlexPicker click={(c) => {
                                slots()[3].type = c;
                                setSelectedSlot(3);
                            }} />
                        </div>
                    </button>
                    <button class="basis-40" onClick={() => setSelectedSlot(4)} >
                        <Show when={slots()[4].value} fallback={<CroppedImage
                            imgbg="bg-black"
                            bg="bg-violet-800"
                            image="Empty.png"
                            borderSize="32" maxWidth="130" minWidth="130"
                            imageSize="26" imageH="55%" imageV="45%" />}>
                            <CroppedImage
                                imgbg="bg-black"
                                bg="bg-violet-800"
                                image={slots()[4].value}
                                borderSize="42" maxWidth="130" minWidth="130"
                                imageSize="38" imageH="55%" imageV="45%" />
                        </Show>
                    </button>
                    <button class="basis-40" onClick={() => setSelectedSlot(5)} >
                        <Show when={slots()[5].value} fallback={<CroppedImage
                            imgbg="bg-black"
                            bg="bg-yellow-800"
                            image="Empty.png"
                            borderSize="32" maxWidth="130" minWidth="130"
                            imageSize="26" imageH="55%" imageV="45%" />}>
                            <CroppedImage
                                imgbg="bg-black"
                                bg="bg-yellow-700"
                                image={slots()[5].value}
                                borderSize="42" maxWidth="130" minWidth="130"
                                imageSize="38" imageH="50%" imageV="45%" />
                        </Show>
                    </button>
                    <button class="basis-40 flexAugment" >
                        <Show when={slots()[6].value} fallback={<CroppedImage
                            imgbg="bg-black"
                            bg="bg-stone-500"
                            image="Empty.png"
                            borderSize="32" maxWidth="130" minWidth="130"
                            imageSize="26" imageH="55%" imageV="45%" />}>
                            <CroppedImage
                                imgbg="bg-black"
                                bg={getColor(slots()[6].type)}
                                image={slots()[6].value}
                                borderSize="42" maxWidth="130" minWidth="130"
                                imageSize="38" imageH="55%" imageV="45%" />
                        </Show>
                        <div class="text-white flexAugment-picker">
                            <FlexPicker click={(c) => {
                                slots()[6].type = c;
                                setSelectedSlot(6);
                            }} />
                        </div>
                    </button>
                    <button class="basis-40 flexAugment" >
                        <Show when={slots()[7].value} fallback={<CroppedImage
                            imgbg="bg-black"
                            bg="bg-stone-500"
                            image="Empty.png"
                            borderSize="32" maxWidth="130" minWidth="130"
                            imageSize="26" imageH="55%" imageV="45%" />}>
                            <CroppedImage
                                imgbg="bg-black"
                                bg={getColor(slots()[7].type)}
                                image={slots()[7].value}
                                borderSize="42" maxWidth="130" minWidth="130"
                                imageSize="38" imageH="55%" imageV="45%" />
                        </Show>
                        <div class="text-white flexAugment-picker">
                            <FlexPicker click={(c) => {
                                slots()[7].type = c;
                                setSelectedSlot(7);
                            }} />
                        </div>
                    </button>
                </div>

                <div class="flex flex-row flex-wrap p-2">
                    <Switch >

                        <Match when={slots()[selectedSlot()].type === "POSITIONAL"}>
                            <For each={positional.Contents}>
                                {(item) =>
                                    <div class="basis-1/3 border-white border-2">
                                        <div class="flex flex-col">
                                            <div class="basis-2/12 m-2 border-white border-b-2">{item.Name}</div>
                                            <div class="basis-10/12">
                                                <AugmentCategory dir={"/POSITIONAL/"} color="sky-700" data={item}
                                                    click={(iconPath) => {
                                                        if (slots().some(x => x.value == iconPath)) {
                                                            return
                                                        }
                                                        slots()[selectedSlot()].value = iconPath;
                                                        setSlots(slots());
                                                    }} />
                                            </div>
                                        </div>
                                    </div>
                                }
                            </For>
                        </Match>

                        <Match when={slots()[selectedSlot()].type === "ACTIVE"}>
                            <For each={actives}>
                                {(item) =>
                                    <button class="basis-1/6 text-center pb-2 augment" onClick=
                                        {() => {
                                            slots()[selectedSlot()].value = "ACTIVE/" + item.IconName;
                                            setSlots(slots());
                                        }}>
                                        <div class="basis-10/12">
                                            <CroppedImage
                                                imgbg="bg-black"
                                                bg={"bg-yellow-700"}
                                                image={"ACTIVE/" + item.IconName}
                                                borderSize="40" maxWidth="100" minWidth="60"
                                                imageSize="38" imageH="50%" imageV="50%" />
                                        </div>
                                        <div class={"basis-2/12 text-sm text-" + props.color}>{item.Name}</div>
                                        <div class="augment-tooltip  w-80">
                                            <AugmentDescription data={item} />
                                        </div>
                                    </button>
                                }
                            </For>
                        </Match>

                        <Match when={slots()[selectedSlot()].type === "RED"}>
                            <For each={data().Augments.filter((item) => item.Type == "RED")[0].Contents}>
                                {(item) =>
                                    <div class="basis-1/3 border-white border-2">
                                        <div class="flex flex-col">
                                            <div class="basis-2/12 m-2 border-white border-b-2">{item.Name}</div>
                                            <div class="basis-10/12">
                                                <AugmentCategory dir={props.path + "RED/"} color="red-800" data={item}
                                                    click={(iconPath) => {
                                                        if (slots().some(x => x.value == iconPath)) {
                                                            return
                                                        }
                                                        slots()[selectedSlot()].value = iconPath;
                                                        setSlots(slots());
                                                    }} />
                                            </div>
                                        </div>
                                    </div>
                                }
                            </For>
                        </Match>

                        <Match when={slots()[selectedSlot()].type === "YELLOW"}>
                            <For each={data().Augments.filter((item) => item.Type == "YELLOW")[0].Contents}>
                                {(item) =>
                                    <div class="basis-1/3 border-white border-2">
                                        <div class="flex flex-col">
                                            <div class="basis-2/12 m-2 border-white border-b-2">{item.Name}</div>
                                            <div class="basis-10/12">
                                                <AugmentCategory dir={props.path + "YELLOW/"} color="yellow-600" data={item}
                                                    click={(iconPath) => {
                                                        if (slots().some(x => x.value == iconPath)) {
                                                            return
                                                        }
                                                        slots()[selectedSlot()].value = iconPath;
                                                        setSlots(slots());
                                                    }} />
                                            </div>
                                        </div>
                                    </div>
                                }
                            </For>
                        </Match>

                        <Match when={slots()[selectedSlot()].type === "ULT"}>
                            <For each={data().Augments.filter((item) => item.Type == "ULT")[0].Contents}>
                                {(item) =>
                                    <button class="basis-1/3 border-white border-2 text-center augment" onClick=
                                        {() => {
                                            slots()[selectedSlot()].value = props.path + "ULT/" + item.IconName;
                                            setSlots(slots());
                                        }}>
                                        <div class="basis-10/12">
                                            <CroppedImage
                                                imgbg="bg-black"
                                                bg={"bg-violet-800"}
                                                image={props.path + "ULT/" + item.IconName}
                                                borderSize="40" maxWidth="100" minWidth="60"
                                                imageSize="38" imageH="50%" imageV="50%" />
                                        </div>
                                        <div class="basis-2/12">
                                            <AugmentDescription data={item} />
                                        </div>
                                    </button>
                                }
                            </For>
                        </Match>
                    </Switch>
                </div>

            </Show >
        </div >
    );
}

export default Hero;