//Common Math Operation Library by MrAlinoë Creations
//Cyril Trinaux 2020 (based from 2018-2019 notes)
//Version:1.1 Date:16/09/22


/**
* Get Distance Between 2 points with XY coordinates
* @author AlinoeTheBunny
* @param {number} x0 - X data of point 1
* @param {number} y0 - Y data of point 1
* @param {number} x1 - X data of point 2
* @param {number} y1 - Y data of point 2
* @return {number} - Distance between two points (px)
*/
function getDistanceBetween(x0,y0,x1,y1) {
	return Math.sqrt(Math.pow(x1-x0,2)+Math.pow(y1-y0,2));
}
/**
* Get Angle between 2 points with XY coordinates
* @author AlinoeTheBunny
* @param {number} x0 - X data of point 1
* @param {number} y0 - Y data of point 1
* @param {number} x1 - X data of point 2
* @param {number} y1 - Y data of point 2
* @return {number} - Angle from 1 to 2 in degrees
*/
function getAngleBetween(x0,y0,x1,y1) {
	let temp = Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI;
	if (temp < 0)
	{
		temp = (180-Math.abs(temp))+180;
	}
	// return Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI;
	return temp;
}
/**
* Check if a point (z) is between 2 points (1 and 2)
* @author AlinoeTheBunny
* @param {number} x0 - X data of point 1
* @param {number} y0 - Y data of point 1
* @param {number} x1 - X data of point 2
* @param {number} y1 - Y data of point 2
* @param {number} z0 - X data of point Z
* @param {number} z1 - Y data of point Z
* @param {number} tol - Hitbox tolerance to allow user to avoid pixel perfect detection
* @return {boolean} - The Z point is between 1 and 2 (true/false)
*/
function isBetween(x0,y0,x1,y1,z0,z1,tol) {
	let xy_dist = getDistanceBetween(x0,y0,x1,y1);
	let zx_dist = getDistanceBetween(x0,y0,z0,z1);
	let zy_dist = getDistanceBetween(x1,y1,z0,z1);
	//Si la somme de la distance entre 1/Z et 2/Z est égale a la distance 1/2, le point Z est entre les deux points
	//Il ne peux pas être inférieur car mathématiquement impossible, on ajoute a 1/2 une valeur de tolérance sans quoi il faudra être parfait au pixel près
	if ((zx_dist+zy_dist)<=(xy_dist+tol))
	{
		return true;
	}
	else
	{
		return false;
	}
}
/**
* Project a point from another with xy value of the base point, angle and distance
* @author AlinoeTheBunny
* @param {number} x - X data of base point
* @param {number} y - Y data of base point
* @param {number} dist - Distance between base point and new point
* @param {number} ang - Angle from base point to new point
* @param {boolean} dec - Optional parameter, true if not defined, put false to skip round operation
* @return {number} 0 - X value of new point
* @return {number} 1 - Y value of new point
*/
function projectAPoint(x,y,dist,ang,dec) {
	let x_move = (Math.cos(ang  * Math.PI / 180)) * dist + x;
	let y_move = (Math.sin(ang  * Math.PI / 180)) * dist + y;
	if (dec == true || dec == undefined) {
		//Remove decimal values
		x_move = Math.round(x_move);
		y_move = Math.round(y_move);
	}
	return [x_move,y_move];
}
/**
* Get Absolute XY Distance Between 2 points with XY coordinates (Matrix)
* @author AlinoeTheBunny
* @param {number} x0 - X data of point 1
* @param {number} y0 - Y data of point 1
* @param {number} x1 - X data of point 2
* @param {number} y1 - Y data of point 2
* @return {number} 0 - X absolute distance between the points
* @return {number} 1 - Y absolute distance between the points
*/
function getSideDistance(x0,y0,x1,y1) {
	return [x1-x0,y1-y0];
}

//EXPERIMENTAL FEATURES

/**
* Check if a point is on a angle between 3 points
* This function purpose can be to detect collision on convex polygons on a more complex form
* @author AlinoeTheBunny
* @param {number} ox - X data of the origin point (where the angle start)
* @param {number} oy - Y data of the origin point (where the angle start)
* @param {number} tx - X data of the target point (checked if on the angle)
* @param {number} ty - Y data of the target point (checked if on the angle)
* @param {number} ax - X data or the first side point
* @param {number} ay - Y data or the first side point
* @param {number} bx - X data or the second side point
* @param {number} by - Y data or the second side point
* @return {boolean} - True or False
*/
function isOnAngle(ox,oy,tx,ty,ax,ay,bx,by) {
	let t_angle = getAngleBetween(ox,oy,tx,ty); //Target
	let ang0 = getAngleBetween(ox,oy,ax,ay);
	let ang1 = getAngleBetween(ox,oy,bx,by);
	if (ang0 < 0) { ang0 = 360-ang0}
	if (ang1 < 0) { ang1 = 360-ang1}
	//Invert values if needed
	if (ang1 < ang0)
	{
		temp = ang0;
		ang0 = ang1;
		ang1 = temp;
	}
	console.log(t_angle);
	console.log(ang0);
	console.log(ang1);
	//Check if between the 2 angles values
	if (t_angle > ang0 && t_angle < ang1)
	{
		return true;
	}
	else
	{
		return false;
	}
}

/**
* This function check if a point is on a polygon
* Method used is checking if every corner has the target on their angle with isOnAngle();
* WARNING!!! This method can only work on a convex form
* @author AlinoeTheBunny
* @param {array} polygon - This array contain all polygon point under this form [[point_1_X,point_1_Y],[point_2_X,point_2_Y],...]
* @param {number} tx - X data of the target point
* @param {number} ty - Y data of the target point
* @return {boolean} - True or False
*/
function isCollidingConvX(polygon,tx,ty) {
	if (typeof(polygon) == "object")
	{
		if (polygon.length > 2)
		{
			//Check done, now do the job
			let result = true;
			let sec_target = [polygon.length-1,1];
			for (let i=0;i<polygon.length;i++)
			{
				console.log(polygon[i][0],polygon[i][1],tx,ty,polygon[sec_target[0]][0],polygon[sec_target[0]][1],polygon[sec_target[1]][0],polygon[sec_target[1]][1]);
				if (isOnAngle(polygon[i][0],polygon[i][1],tx,ty,polygon[sec_target[0]][0],polygon[sec_target[0]][1],polygon[sec_target[1]][0],polygon[sec_target[1]][1]) == false)
				{
					result = false;
					console.log("false");
				}
				else
				{
					console.log("true");
				}
				sec_target[0] += 1;
				sec_target[1] += 1;
				if (sec_target[0] > polygon.length-1)
				{
					sec_target[0] = 0;
				}
				if (sec_target[1] > polygon.length-1)
				{
					sec_target[1] = 0;
				}
			}
			//Return the result
			return result;
		}
		else
		{
			console.log("error: 3 points minimum");
		}
	}
	else
	{
		console.log("error: polygon must be an array");
	}
}