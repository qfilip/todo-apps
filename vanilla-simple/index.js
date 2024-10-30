{
	const make = (tagName, parent, attr) => parent.appendChild(
			Object.assign(document.createElement(tagName), attr)
		),
		
		addToDo = (value) => {
			const li = make("li", toDoList);
			make("input", li, {
				readonly : true,
				name : "todo[]",
				value
			});
			make("button", li, {
				onclick : (e) => { e.currentTarget.closest("li").remove(); },
				textContent : "Remove",
        type : "button"
			});
		},
		
		form = make("form", document.querySelector("main"), {
			onsubmit : (e) => {
        e.preventDefault();
        addToDo(addInput.value);
        addInput.value = "";
			}
		}),
		fieldset = make("fieldset", form),
		addLabel = make("label", fieldset, { textContent : "Title:" }),
		addInput = make("input", addLabel, { required : "true" }),
		toDoList = make("ul", form);

	make("button", fieldset, { textContent : "Create" });

}