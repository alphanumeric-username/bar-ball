type ColorTableRaw = {
    primary: string;
    secondary: string;
    secondary_dark: string;
};

type ColorTable = {
    primary: number;
    secondary: number;
    secondary_dark: number;
};

var colorTable: ColorTable;

async function load() {
    const config: ColorTableRaw = await fetch('./config/colors.json').then(res => res.json());
    colorTable.primary = Number.parseInt(config.primary);
    colorTable.secondary = Number.parseInt(config.secondary);
    colorTable.secondary_dark = Number.parseInt(config.secondary_dark);
}

load();

export { colorTable };