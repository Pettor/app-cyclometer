import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./SlotStrip-Bo0NKHHa.js";var r,i,a,o,s,c,l;function u(){return(u=e((()=>{t(),{expect:r}=__STORYBOOK_MODULE_TEST__,i={title:`Display/Slot Strip`,component:n,tags:[`autodocs`]},a={step:{num:7,groups:[4,3],slots:[`a`,`r`,`n`,`r`,`a`,`r`,`n`]}},o={args:a,play:async({canvas:e})=>{await r(e.getByRole(`img`,{name:`7 slots, 2 accented, 3 rests`})).toBeInTheDocument()}},s={args:{...a,activeSlot:2}},c={args:{step:{num:11,groups:[3,3,3,2],slots:[`n`,`n`,`n`,`a`,`n`,`n`,`a`,`n`,`n`,`a`,`n`]},size:`sm`}},l=[`Default`,`Playing`,`Small`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: defaultArgs,
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole("img", {
      name: "7 slots, 2 accented, 3 rests"
    })).toBeInTheDocument();
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    ...defaultArgs,
    activeSlot: 2
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    step: {
      num: 11,
      groups: [3, 3, 3, 2],
      slots: ["n", "n", "n", "a", "n", "n", "a", "n", "n", "a", "n"]
    },
    size: "sm"
  }
}`,...c.parameters?.docs?.source}}}})))()}u();export{o as Default,s as Playing,c as Small,l as __namedExportsOrder,i as default};