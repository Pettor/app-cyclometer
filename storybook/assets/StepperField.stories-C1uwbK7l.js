import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./react-Q1GcV6wX.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./StepperField-CMEP6Mxh.js";var a,o,s,c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{a=t(),r(),o=n(),{expect:s,fn:c}=__STORYBOOK_MODULE_TEST__,l={title:`Input/Stepper Field`,component:i,tags:[`autodocs`]},u={label:`Replays`,value:2,minValue:1,maxValue:32,onChange:c(),prefix:`×`},d={args:u,play:async({args:e,canvas:t,userEvent:n})=>{let r=t.getAllByRole(`button`);await n.click(r[r.length-1]),await s(e.onChange).toHaveBeenCalledWith(3)}},f={args:{...u,hideLabel:!0,size:`sm`},play:async({canvas:e})=>{await s(e.getByRole(`textbox`,{name:`Replays`})).toBeInTheDocument()}},p={args:{...u,value:1},play:async({canvas:e})=>{await s(e.getAllByRole(`button`)[0]).toBeDisabled()}},m={render:function(e){let[t,n]=(0,a.useState)(e.value);return(0,o.jsx)(i,{...e,value:t,onChange:n})},args:{...u,label:`Beats`,value:7,minValue:2,maxValue:17,prefix:void 0},play:async({canvas:e,userEvent:t})=>{await t.click(e.getAllByRole(`button`)[0]),await s(e.getByRole(`textbox`,{name:`Beats`})).toHaveValue(`6`)}},h=[`Default`,`HiddenLabel`,`AtMinimum`,`Interactive`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: defaultArgs,
  play: async ({
    args,
    canvas,
    userEvent
  }) => {
    const buttons = canvas.getAllByRole("button");
    await userEvent.click(buttons[buttons.length - 1]!);
    await expect(args.onChange).toHaveBeenCalledWith(3);
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    ...defaultArgs,
    hideLabel: true,
    size: "sm"
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getByRole("textbox", {
      name: "Replays"
    })).toBeInTheDocument();
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    ...defaultArgs,
    value: 1
  },
  play: async ({
    canvas
  }) => {
    await expect(canvas.getAllByRole("button")[0]).toBeDisabled();
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <Component {...args} value={value} onChange={setValue} />;
  },
  args: {
    ...defaultArgs,
    label: "Beats",
    value: 7,
    minValue: 2,
    maxValue: 17,
    prefix: undefined
  },
  play: async ({
    canvas,
    userEvent
  }) => {
    await userEvent.click(canvas.getAllByRole("button")[0]!);
    await expect(canvas.getByRole("textbox", {
      name: "Beats"
    })).toHaveValue("6");
  }
}`,...m.parameters?.docs?.source}}}})))()}g();export{p as AtMinimum,d as Default,f as HiddenLabel,m as Interactive,h as __namedExportsOrder,l as default};