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

export function position_tooltip() {
    console.log("position tooltip called");
    // Get .ktooltiptext sibling
    var tooltip = this.parentNode.querySelector(".augment-tooltip");

    // Get calculated ktooltip coordinates and size
    var tooltip_rect = this.getBoundingClientRect();

    var tipX = tooltip_rect.width - 5; // 5px on the right of the ktooltip
    var tipY = -40;                     // 40px on the top of the ktooltip
    // Position tooltip
    // tooltip.style.top = tipY + 'px';
    // tooltip.style.left = tipX + 'px';

    // Get calculated tooltip coordinates and size
    var tooltip_rect = tooltip.getBoundingClientRect();
    // Corrections if out of window
    if ((tooltip_rect.x + tooltip_rect.width) > window.innerWidth) // Out on the right
        tipX = -tooltip_rect.width - 5;  // Simulate a "right: tipX" position
    if (tooltip_rect.y < 0)            // Out on the top
        tooltip.style.top = (tipY - tooltip_rect.y) + 'px';    // Align on the top

    // Apply corrected position
    // tooltip.style.top = tipY + 'px';
    tooltip.style.left = tipX + 'px';
}