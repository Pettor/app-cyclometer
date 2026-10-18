import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./AppHeader-DXTBqOxN.js";var r,i,a,o,s,c,l;function u(){return(u=e((()=>{t(),{expect:r,fn:i}=__STORYBOOK_MODULE_TEST__,a={title:`Navigation/App Header`,component:n,tags:[`autodocs`],parameters:{layout:`fullscreen`}},o={activeSection:`flow`,subtitle:`Odd-meter study flow`,onNavigate:i(),onOpenSettings:i()},s={args:o,play:async({args:e,canvas:t,userEvent:n})=>{await r(t.getByTestId(`app-header__nav-flow`)).toHaveAttribute(`aria-current`,`page`),await n.click(t.getByTestId(`app-header__nav-drums`)),await r(e.onNavigate).toHaveBeenCalledWith(`drums`)}},c={args:{...o,activeSection:`drums`,subtitle:`Turn the time signature flow into a drum part`}},l=[`Flow`,`DrumLab`],s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: defaultArgs,
  play: async ({
    args,
    canvas,
    userEvent
  }) => {
    await expect(canvas.getByTestId("app-header__nav-flow")).toHaveAttribute("aria-current", "page");
    await userEvent.click(canvas.getByTestId("app-header__nav-drums"));
    await expect(args.onNavigate).toHaveBeenCalledWith("drums");
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    ...defaultArgs,
    activeSection: "drums",
    subtitle: "Turn the time signature flow into a drum part"
  }
}`,...c.parameters?.docs?.source}}}})))()}u();export{c as DrumLab,s as Flow,l as __namedExportsOrder,a as default};