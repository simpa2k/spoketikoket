$(function() {

	function positionNewElement(element, elementToPositionRelativeTo) {

		var top = $(elementToPositionRelativeTo).position().top + 50;
		var left = $(elementToPositionRelativeTo).position().left;

		$(element).css({
			"position": "absolute",
			"z-index": "10",
			"width": "50px",
			"top": top,
			"left": left
		});
		
		console.log($(elementToPositionRelativeTo).offset());

	}

	$("#header a").mouseover(function() {

		var nameOfNewElement = $(this).attr('id') + "text_liten";

		$(this).parents("#header").after(
			"<img id='" + nameOfNewElement + "' src='static/images/sociala_medier/" + nameOfNewElement + ".jpg'>"
			);

		positionNewElement($("#" + nameOfNewElement), $(this));

	});

	$("#header a").mouseout(function() {

		var idOfTextElement = "#" + $(this).attr('id') + "text_liten";

		$(idOfTextElement).remove();		

	});

});