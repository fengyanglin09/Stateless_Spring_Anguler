import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';
import {ThemeType} from "primeng/config";


const MayoBlue = definePreset(Aura, {
    semantic: {
        primary: {
            50:'#f4fafe',
            100:'#cae6fc',
            200:'#a0d2fa',
            300:'#75bef8',
            400:'#4baaf5',
            500:'#2196f3',
            600:'#1c80cf',
            700:'#1769aa',
            800:'#125386',
            900:'#0d3c61',
            950:'#00285c'
        }
    },
    components: {
        badge: {
            colorScheme: {
                light: {
                    primary: {
                        background: '#2196f3'
                    }
                }
            }
        }
    }
});

const MayoTheme = {
    preset: MayoBlue,
    options: {
        darkModeSelector: '.app-dark',
        darkTheme: false
    }
} as ThemeType;

export {MayoBlue, MayoTheme}
