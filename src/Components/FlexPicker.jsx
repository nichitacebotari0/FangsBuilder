function FlexPicker(props) {

    return (
        <div class="border-white border-2 bg-black flex flex-row items-center p-2">
            <div onClick={() => props.click("RED")} class="basis-1/3 text-md text-red-500 active:text-sky-100 p-1 border-r-2 border-r-gray-600 ">Combat</div>
            <div onClick={() => props.click("YELLOW")} class="basis-1/3 text-md text-yellow-500 active:text-sky-100 p-1 border-r-2 border-r-gray-600">Utility</div>
            <div onClick={() => props.click("POSITIONAL")} class="basis-1/3 text-md text-blue-600 active:text-sky-100 p-1">Positional</div>
        </div>
    )
}

export default FlexPicker;