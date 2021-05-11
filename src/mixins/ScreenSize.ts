import { defineComponent } from 'vue';

const breakpoints = [
  {
    name: "xl",
    pixels: 1200
  },
  {
    name: "lg",
    pixels: 992
  },
  {
    name: "md",
    pixels: 768
  },
  {
    name: "sm",
    pixels: 576
  },
  {
    name: "xs",
    pixels: 0
  }
];

const breakpointMap: {[name: string]: any} = {};
for (let i = 0; i < breakpoints.length; i++) {
  breakpointMap[breakpoints[i].name] = breakpoints[i];
}

export default defineComponent({
  data: function() {
    return {
      myScreenWidth: null
    }
  },
  computed: {
    screenWidth(): number {
      return this.myScreenWidth || this.getScreenWidth();
    },
    breakpointObject(): any {
      return breakpoints.find((breakpoint: any) => this.screenWidth >= breakpoint.pixels);
    },
    breakpoint(): string {
      return this.breakpointObject.name;
    }
  },
  methods: {
    getScreenWidth() {
      return window.innerWidth
              || document.documentElement.clientWidth
              || document.body.clientWidth;
    },
    handleResize() {
      this.myScreenWidth = this.getScreenWidth();
    },
    screenSizeAtLeast(breakpoint: string): boolean {
      return this.breakpointObject.pixels >= breakpointMap[breakpoint].pixels;
    },
    screenSizeAtMost(breakpoint: string): boolean {
      return this.breakpointObject.pixels <= breakpointMap[breakpoint].pixels;
    },
    screenSizeGreaterThan(breakpoint: string): boolean {
      return this.breakpointObject.pixels > breakpointMap[breakpoint].pixels;
    },
    screenSizeLessThan(breakpoint: string): boolean {
      return this.breakpointObject.pixels < breakpointMap[breakpoint].pixels;
    }
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  }
});
