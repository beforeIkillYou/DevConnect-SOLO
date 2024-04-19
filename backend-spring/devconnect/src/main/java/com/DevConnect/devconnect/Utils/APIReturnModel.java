package com.DevConnect.devconnect.Utils;

import java.util.Vector;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class APIReturnModel {
	private String status="fail";
	private String message = "Something Went Wrong !!";
	private Vector<?> data;
	private int count =0;
}