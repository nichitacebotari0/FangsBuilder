import { useParams, useSearchParams } from "@solidjs/router";
import { createEffect, createResource, createSignal, For, Match, Show, Switch } from "solid-js";
import getAugmentColor, { position_tooltip } from "../Utils/Functions";
import AugmentCategory from "./AugmentCategory";
import AugmentDescription from "./AugmentDescription";
import AugmentSlot from "./AugmentSlot";

async function fetcher(path, { value, refetching }) {
    resetAugments();
    let result = (await fetch(path));
    return await result.json();
}

const augmentSlots = [
    { originalType: "POSITIONAL", type: "POSITIONAL", value: null, text: "" },
    { originalType: "RED", type: "RED", value: null, text: "" },
    { originalType: "YELLOW", type: "YELLOW", value: null, text: "" },
    { originalType: "FLEX", type: "FLEX", value: null, text: "" },
    { originalType: "ULT", type: "ULT", value: null, text: "" },
    { originalType: "ACTIVE", type: "ACTIVE", value: null, text: "" },
    { originalType: "FLEX", type: "FLEX", value: null, text: "" },
    { originalType: "FLEX", type: "FLEX", value: null, text: "" }
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
                <div class="flex flex-wrap items-center justify-center mb-2 border-b-2 ml-2 mr-2 border-b-blue-800" >
                    <AugmentSlot click={() => setSelectedSlot(0)} slot={slots()[0]} />
                    <AugmentSlot click={() => setSelectedSlot(1)} slot={slots()[1]} />
                    <AugmentSlot click={() => setSelectedSlot(2)} slot={slots()[2]} />
                    <AugmentSlot click={() => setSelectedSlot(3)} slot={slots()[3]} />
                    <AugmentSlot click={() => setSelectedSlot(4)} slot={slots()[4]} />
                    <AugmentSlot click={() => setSelectedSlot(5)} slot={slots()[5]} />
                    <AugmentSlot click={() => setSelectedSlot(6)} slot={slots()[6]} />
                    <AugmentSlot click={() => setSelectedSlot(7)} slot={slots()[7]} />
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
                            {<For each={actives}>
                                {(item) =>
                                    <button class="basis-1/6 text-center pb-2 augment" onClick=
                                        {() => {
                                            slots()[selectedSlot()].value = "../ACTIVE/" + item.IconName;
                                            slots()[selectedSlot()].text = item.Name;
                                            setSlots(slots());
                                        }}
                                        onMouseEnter={position_tooltip} onPointerEnter={position_tooltip}>
                                        <div class="basis-10/12">
                                            <div class={"clip-augment-container inline-block " + getAugmentColor(slots()[selectedSlot()].type) + " active:bg-sky-100"}>
                                                <img class="clip-augment-image bg-black"
                                                    src={"../ACTIVE/" + item.IconName} />
                                            </div>
                                        </div>
                                        <div class={"basis-2/12 text-sm text-" + props.color}>{item.Name}</div>
                                        <div class="relative">
                                            <div class="augment-tooltip w-40 lg:w-80">
                                                <AugmentDescription data={item} />
                                            </div>
                                        </div>
                                    </button>
                                }
                            </For>

                            }
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
                                    <button class="basis-1/3 border-white border-2 text-center" onClick=
                                        {() => {
                                            slots()[selectedSlot()].value = location.origin + location.pathname + "/" + "ULT/" + item.IconName;
                                            slots()[selectedSlot()].text = item.Name;
                                            setSlots(slots());
                                        }}>
                                        <div class="basis-10/12">
                                            <div class={"clip-augment-container inline-block " + getAugmentColor(slots()[selectedSlot()].type) + " active:bg-sky-100"}>
                                                <img class="clip-augment-image bg-black"
                                                    src={location.origin + location.pathname + "/" + "ULT/" + item.IconName} />
                                            </div>
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