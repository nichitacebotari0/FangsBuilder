import { useParams, useSearchParams } from "@solidjs/router";
import { createDeferred, createEffect, createResource, createSignal, For, Match, Show, Switch } from "solid-js";
import AugmentCategory from "./AugmentCategory";
import AugmentDescription from "./AugmentDescription";
import CroppedImage from "./CroppedImage";
import FlexPicker from "./FlexPicker";

async function fetcher(path, { value, refetching }) {
    resetAugments();
    let result = (await fetch(path));
    return await result.json();
}

const augmentSlots = [
    { type: "POSITIONAL", value: null, text: "" },
    { type: "RED", value: null, text: "" },
    { type: "YELLOW", value: null, text: "" },
    { type: "FLEX", value: null, text: "" },
    { type: "ULT", value: null, text: "" },
    { type: "ACTIVE", value: null, text: "" },
    { type: "FLEX", value: null, text: "" },
    { type: "FLEX", value: null, text: "" }
]

// this is why all augments should have an id unique, god im gonna move this all to sqlite soon,
// and all img paths should be absolute
function encodeAugments(augmentSlots) {
    return augmentSlots
        .map(x => {
            let val = "";
            let split = x.value?.split('/');
            if (!split)
                return x.type;
            if (x.type == "ULT" || x.type == "ACTIVE") {
                val = split[split.length - 1].split('_')[0]
            }
            else {
                val = split[split.length - 2].split('.')[0] + '/' + split[split.length - 1].split('_')[0];
            }
            return x.type + '/' + val;
        })
        .join(",");
}

function decodeAugments(query, positionalJson, activeJson, heroJson, slots, setSlots) {
    console.log("decode called:  " + query);
    console.log(heroJson);
    console.log(activeJson);
    if (!query)
        return;
    var augment = query.split(',');
    for (let i = 0; i < augment.length; i++) {
        let x = augment[i];
        let split = x.split('/');
        let val = { value: null, text: "" }
        if (split.length <= 1)
            continue;
        if (split[0] == "ULT") {
            var aug = heroJson
                .filter(t => t.Type == "ULT")[0]
                .Contents
                .filter(t => t.Id == split[1])[0];
            val.value = location.origin + location.pathname + "/" + "ULT/" + aug.IconName;
            val.text = aug.Name;
        }
        else if (split[0] == "ACTIVE") {
            var aug = activeJson
                .filter(t => t.Id == split[1])[0];
            val.value = "../ACTIVE/" + aug.IconName;
            val.text = aug.Name;
        }
        else if (split[0] == "POSITIONAL") {
            var category = positionalJson
                .Contents
                .filter(t => t.Id == split[1])[0];
            var aug = category.Augments
                .filter(t => t.Id == split[2])[0];
            val.value = "../POSITIONAL/" + category.Id + "." + category.Name + "/" + aug.IconName;
            val.text = aug.Name;
        }
        else {
            var category = heroJson
                .filter(t => t.Type == split[0])[0]
                .Contents
                .filter(t => t.Id == split[1])[0]
            var aug = category
                .Augments
                .filter(t => t.Id == split[2])[0];
            val.value = location.origin + location.pathname + "/" + split[0] + "/" + category.Id + "." + category.Name + "/" + aug.IconName;
            val.text = aug.Name;
        }
        slots[i].type = split[0];
        slots[i].value = val.value;
        slots[i].text = val.text;
    };
    setSlots(slots);
}

function resetAugments() {
    augmentSlots.forEach(element => {
        element.value = null;
        element.text = "";
    });
}

function getColor(type) {
    switch (type) {
        case "RED":
            return "bg-red-800";
        case "YELLOW":
            return "bg-yellow-600";
        case "POSITIONAL":
            return "bg-sky-700";
    }
}

const positional = await (await fetch("/POSITIONAL/Info.json")).json()
const actives = await (await fetch("/ACTIVE/Info.json")).json()
function Hero(props) {
    const params = useParams();
    const [data] = createResource(() => (location.origin + "/Heroes/" + params.Hero + "/HeroInfo.json"), fetcher);
    const [searchParams, setSearchParams] = useSearchParams();
    const [slots, setSlotsContent] = createSignal(augmentSlots, { equals: false });
    function setSlots(input) { setSlotsContent(input); setSearchParams({ build: encodeAugments(slots()) }) }
    const [selectedSlot, setSelectedSlot] = createSignal(0, { equals: false });
    let sl = slots();
    let querystr = searchParams.build;
    createEffect((prev) => {
        let current = params.Hero;
        if (prev && prev.length > 0 && prev !== current) {
            return current;
        }
        if (data.state == "ready")
            decodeAugments(querystr, positional, actives, data().Augments, sl, setSlotsContent)
        return current;
    });
    return (
        <div class=" text-sky-50">
            <Show when={data.state == "ready"}>
                <div class="flex flex-col justify-center mt-2 mb-2 p-2">
                    <div class="basis-10/12 text-center">
                        <CroppedImage
                            imgbg="bg-black"
                            image={location.origin + location.pathname + "/" + data().IconName}
                            bg="bg-sky-800"
                            borderSize="42"
                            imageSize="38" imageH="60%" imageV="55%" />
                    </div>
                    <div class="basis-2/12 text-center border-b-blue-800 border-b-2">{data().Name}</div>
                </div>

                <div class="flex flex-wrap items-center justify-center mb-2 border-b-2 ml-2 mr-2 border-b-blue-800" >
                    <button class="basis-40" onClick={() => setSelectedSlot(0)} >
                        <Show when={slots()[0].value} fallback={<CroppedImage
                            imgbg="bg-black"
                            bg="bg-sky-700  active:bg-sky-100"
                            image={location.origin + "/" + "Empty.png"}
                            borderSize="32" maxWidth="130" minWidth="130"
                            imageSize="26" imageH="55%" imageV="45%" />}>
                            <CroppedImage
                                imgbg="bg-black"
                                bg="bg-sky-700 active:bg-sky-100"
                                image={slots()[0].value}
                                borderSize="42" maxWidth="130" minWidth="130"
                                imageSize="38" imageH="55%" imageV="45%" />
                            <div>{slots()[0].text}</div>
                        </Show>
                    </button>
                    <button class="basis-40" onClick={() => setSelectedSlot(1)} >
                        <Show when={slots()[1].value} fallback={<CroppedImage
                            imgbg="bg-black"
                            bg="bg-red-800 active:bg-sky-100"
                            image={location.origin + "/" + "Empty.png"}
                            borderSize="32" maxWidth="130" minWidth="130"
                            imageSize="26" imageH="55%" imageV="45%" />}>
                            <CroppedImage
                                imgbg="bg-black"
                                bg="bg-red-800 active:bg-sky-100"
                                image={slots()[1].value}
                                borderSize="42" maxWidth="130" minWidth="130"
                                imageSize="38" imageH="55%" imageV="45%" />
                            <div>{slots()[1].text}</div>
                        </Show>
                    </button>

                    <button class="basis-40" onClick={() => setSelectedSlot(2)}>
                        <Show when={slots()[2].value} fallback={<CroppedImage
                            imgbg="bg-black"
                            bg="bg-yellow-600 active:bg-sky-100"
                            image={location.origin + "/" + "Empty.png"}
                            borderSize="32" maxWidth="130" minWidth="130"
                            imageSize="26" imageH="55%" imageV="45%" />}>
                            <CroppedImage
                                imgbg="bg-black"
                                bg="bg-yellow-600 active:bg-sky-100"
                                image={slots()[2].value}
                                borderSize="42" maxWidth="130" minWidth="130"
                                imageSize="38" imageH="55%" imageV="45%" />
                            <div>{slots()[2].text}</div>
                        </Show>
                    </button>
                    <button class="basis-40 flexAugment" >
                        <Show when={slots()[3].value} fallback={<CroppedImage
                            imgbg="bg-black"
                            bg="bg-stone-500 active:bg-sky-100"
                            image={location.origin + "/" + "Empty.png"}
                            borderSize="32" maxWidth="130" minWidth="130"
                            imageSize="26" imageH="55%" imageV="45%" />}>
                            <CroppedImage
                                imgbg="bg-black"
                                bg={getColor(slots()[3].type)}
                                image={slots()[3].value}
                                borderSize="42" maxWidth="130" minWidth="130"
                                imageSize="38" imageH="55%" imageV="45%" />
                            <div>{slots()[3].text}</div>
                        </Show>
                        <div class="text-white flexAugment-picker">
                            <FlexPicker click={(c) => {
                                slots()[3].type = c;
                                setSlots(slots());
                                setSelectedSlot(3);
                            }} />
                        </div>
                    </button>
                    <button class="basis-40" onClick={() => setSelectedSlot(4)} >
                        <Show when={slots()[4].value} fallback={<CroppedImage
                            imgbg="bg-black"
                            bg="bg-violet-800 active:bg-sky-100"
                            image={location.origin + "/" + "Empty.png"}
                            borderSize="32" maxWidth="130" minWidth="130"
                            imageSize="26" imageH="55%" imageV="45%" />}>
                            <CroppedImage
                                imgbg="bg-black"
                                bg="bg-violet-800 active:bg-sky-100"
                                image={slots()[4].value}
                                borderSize="42" maxWidth="130" minWidth="130"
                                imageSize="38" imageH="55%" imageV="45%" />
                            <div>{slots()[4].text}</div>
                        </Show>
                    </button>
                    <button class="basis-40" onClick={() => setSelectedSlot(5)} >
                        <Show when={slots()[5].value} fallback={<CroppedImage
                            imgbg="bg-black"
                            bg="bg-yellow-800 active:bg-sky-100"
                            image={location.origin + "/" + "Empty.png"}
                            borderSize="32" maxWidth="130" minWidth="130"
                            imageSize="26" imageH="55%" imageV="45%" />}>
                            <CroppedImage
                                imgbg="bg-black"
                                bg="bg-yellow-800 active:bg-sky-100"
                                image={slots()[5].value}
                                borderSize="42" maxWidth="130" minWidth="130"
                                imageSize="38" imageH="50%" imageV="45%" />
                            <div>{slots()[5].text}</div>
                        </Show>
                    </button>
                    <button class="basis-40 flexAugment" >
                        <Show when={slots()[6].value} fallback={<CroppedImage
                            imgbg="bg-black"
                            bg="bg-stone-500 active:bg-sky-100"
                            image={location.origin + "/" + "Empty.png"}
                            borderSize="32" maxWidth="130" minWidth="130"
                            imageSize="26" imageH="55%" imageV="45%" />}>
                            <CroppedImage
                                imgbg="bg-black"
                                bg={getColor(slots()[6].type)}
                                image={slots()[6].value}
                                borderSize="42" maxWidth="130" minWidth="130"
                                imageSize="38" imageH="55%" imageV="45%" />
                            <div>{slots()[6].text}</div>
                        </Show>
                        <div class="text-white flexAugment-picker">
                            <FlexPicker click={(c) => {
                                slots()[6].type = c;
                                setSlots(slots());
                                setSelectedSlot(6);
                            }} />
                        </div>
                    </button>
                    <button class="basis-40 flexAugment" >
                        <Show when={slots()[7].value} fallback={<CroppedImage
                            imgbg="bg-black"
                            bg="bg-stone-500 active:bg-sky-100"
                            image={location.origin + "/" + "Empty.png"}
                            borderSize="32" maxWidth="130" minWidth="130"
                            imageSize="26" imageH="55%" imageV="45%" />}>
                            <CroppedImage
                                imgbg="bg-black"
                                bg={getColor(slots()[7].type)}
                                image={slots()[7].value}
                                borderSize="42" maxWidth="130" minWidth="130"
                                imageSize="38" imageH="55%" imageV="45%" />
                            <div>{slots()[7].text}</div>
                        </Show>
                        <div class="text-white flexAugment-picker">
                            <FlexPicker click={(c) => {
                                slots()[7].type = c;
                                setSlots(slots());
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
                                                    click={(obj) => {
                                                        if (slots().some(x => x.value == obj.Path)) {
                                                            return
                                                        }
                                                        slots()[selectedSlot()].value = obj.Path;
                                                        slots()[selectedSlot()].text = obj.Name;
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
                                            slots()[selectedSlot()].value = "../ACTIVE/" + item.IconName;
                                            slots()[selectedSlot()].text = item.Name;
                                            setSlots(slots());
                                        }}>
                                        <div class="basis-10/12">
                                            <CroppedImage
                                                imgbg="bg-black"
                                                bg={"bg-yellow-800"}
                                                image={"../ACTIVE/" + item.IconName}
                                                borderSize="40" maxWidth="100" minWidth="60"
                                                imageSize="38" imageH="50%" imageV="50%" />
                                        </div>
                                        <div class={"basis-2/12 text-sm text-" + props.color}>{item.Name}</div>
                                        <div class="augment-tooltip  w-20 sm:w-32 md:w-56 lg:w-80">
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
                                                <AugmentCategory dir={location.origin + location.pathname + "/" + "RED/"} color="red-800" data={item}
                                                    click={(obj) => {
                                                        if (slots().some(x => x.value == obj.Path)) {
                                                            return
                                                        }
                                                        slots()[selectedSlot()].value = obj.Path;
                                                        slots()[selectedSlot()].text = obj.Name;
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
                                                <AugmentCategory dir={location.origin + location.pathname + "/" + "YELLOW/"} color="yellow-600" data={item}
                                                    click={(obj) => {
                                                        if (slots().some(x => x.value == obj.Path)) {
                                                            return
                                                        }
                                                        slots()[selectedSlot()].value = obj.Path;
                                                        slots()[selectedSlot()].text = obj.Name;
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
                                            slots()[selectedSlot()].value = location.origin + location.pathname + "/" + "ULT/" + item.IconName;
                                            slots()[selectedSlot()].text = item.Name;
                                            setSlots(slots());
                                        }}>
                                        <div class="basis-10/12">
                                            <CroppedImage
                                                imgbg="bg-black"
                                                bg={"bg-violet-800"}
                                                image={location.origin + location.pathname + "/" + "ULT/" + item.IconName}
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