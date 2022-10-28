function getAugmentColor(type) {
    switch (type) {
        case "POSITIONAL":
            return "bg-sky-700";
        case "RED":
            return "bg-red-800";
        case "YELLOW":
            return "bg-yellow-600";
        case "FLEX":
            return "bg-stone-500";
        case "ULT":
            return "bg-violet-800";
        case "ACTIVE":
            return "bg-yellow-800";
    }
}

export default getAugmentColor;

export function position_tooltip(event) {
    var tooltip = event.target.querySelector(".augment-tooltip");
    var tooltip_rect = tooltip.getBoundingClientRect();
    var rightOverflow = tooltip_rect.x + tooltip_rect.width - window.visualViewport.width;
    if (rightOverflow > 0)
        tooltip.style.left = -rightOverflow + 'px';
}