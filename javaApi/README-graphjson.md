README.md

how to run GraphJsonGenerator.jar
java -jar GraphJsonGenerator.jar "./graphData.txt"

input: a file path like "./graphData.txt"
where "./graphData.txt" is a path to the file which is written by Jie Zhou and the content should be like this:
	[[Xilinx(Manufacturer), X1234-4SA(Part #), hw271(Employee), SLK(Name), 254662284(qq)],[{"field":"Product","key":"Part#","value":"CY7C1470V33-167AXI"},{"field":"Product","key":"DeviceType","value":"Synchronous pipelined burst SRAM"},{"field":"Product","key":"Manufacturer","value":"Cypress Semiconductor"},{"field":"Seller","key":"Name","value":"Ms. Judy's store (China (Mainland))"},{"field":"Product","key":"part#","value":"ZB"},{"field":"Product","key":"DeviceType","value":"fBGA"},{"field":"Product","key":"Manufacturer","value":"Cypress Semiconductor"}]]
it is like [[1],[2]]
in the 1st [], the content is from the box. in the 2nd [], the content is from the tagged document.

output: a file "./graphJason.txt"
which is used to show the graph

