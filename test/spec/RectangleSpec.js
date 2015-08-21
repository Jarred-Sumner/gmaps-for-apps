describe('GMaps rectangles', function() {
  var mapInstance, container, rectangle;

  beforeAll(function() {
    container = document.createElement('div');
    container.id = 'map-with-rectangles';
    container.className = 'map';
    document.body.appendChild(container);

    mapInstance = new GMaps({
      el : '#map-with-rectangles',
      lat : -12.0433,
      lng : -77.0283,
      zoom : 12
    });
  });

  afterAll(function() {
    mapInstance.destroy();
    document.body.removeChild(container);
  });

  describe('creation', function() {
    beforeAll(function() {
      rectangle = mapInstance.addRectangle({
        id: 'rectangle-id',
        bounds : [[-12.0303,-77.0237],[-12.0348,-77.0115]],
        strokeColor : '#BBD8E9',
        strokeOpacity : 1,
        strokeWeight : 3,
        fillColor : '#BBD8E9',
        fillOpacity : 0.6
      });
    });

    it('should add the rectangle to the rectangles store', function() {
      expect(mapInstance.rectangles.length).toEqual(1);
      expect(mapInstance.rectangles[0]).toEqual(rectangle);
    });

    it('should be added in the current map', function() {
      expect(rectangle.getMap()).toEqual(mapInstance.map);
    });

    it('should have the defined bounds', function() {
      // Fix for floating-point bug
      var SWLat = parseFloat(rectangle.getBounds().getSouthWest().lat().toFixed(4));
      var SWLng = parseFloat(rectangle.getBounds().getSouthWest().lng().toFixed(4));

      var NELat = parseFloat(rectangle.getBounds().getNorthEast().lat().toFixed(4));
      var NELng = parseFloat(rectangle.getBounds().getNorthEast().lng().toFixed(4));

      expect(SWLat).toEqual(-12.0303);
      expect(SWLng).toEqual(-77.0237);
      expect(NELat).toEqual(-12.0348);
      expect(NELng).toEqual(-77.0115);
    });

    it('should have the configured id', function() {
      expect(rectangle.id).toEqual('rectangle-id');
    });
  });


  describe('events', function() {
    var callbacks, context;

    beforeAll(function() {
      context = { passed: false };
      callbacks = {
        onclick : function() {
          this.passed = true;
        }.bind(context),

        onmousedown: function() {
          return true;
        },

        onmouseover: function() {
          return true;
        }
      };

      spyOn(callbacks, 'onclick').and.callThrough();
      spyOn(callbacks, 'onmousedown').and.callThrough();
      spyOn(callbacks, 'onmouseover').and.callThrough();

      rectangle = mapInstance.addRectangle({
        bounds : [[-12.0303,-77.0237],[-12.0348,-77.0115]],
        strokeColor : '#BBD8E9',
        strokeOpacity : 1,
        strokeWeight : 3,
        fillColor : '#BBD8E9',
        fillOpacity : 0.6,
        click: callbacks.onclick,
        mousedown: callbacks.onmousedown,
        mouseover: callbacks.onmouseover
      });
    });

    it('should respond to click event and maintain method context', function() {
      google.maps.event.trigger(rectangle, 'click', {});
      expect(callbacks.onclick).toHaveBeenCalled();
      expect(context.passed).toBe(true);
    });

    it('should subscribe multiple events', function() {
      google.maps.event.trigger(rectangle, 'mousedown', {});
      expect(callbacks.onmousedown).toHaveBeenCalled();

      google.maps.event.trigger(rectangle, 'mouseover', {});
      expect(callbacks.onmouseover).toHaveBeenCalled();
    });
  });


  describe('removal', function() {
    beforeAll(function() {
      rectangle = mapInstance.addRectangle({
        bounds : [[-12.0303,-77.0237],[-12.0348,-77.0115]],
        strokeColor : '#BBD8E9',
        strokeOpacity : 1,
        strokeWeight : 3,
        fillColor : '#BBD8E9',
        fillOpacity : 0.6
      });
    });

    it('should remove the rectangle from the polygons collection', function() {
      var originalLength = mapInstance.rectangles.length;
      mapInstance.removeRectangle(rectangle);
      expect(mapInstance.rectangles.length).toBeLessThan(originalLength);
      expect(rectangle.getMap()).toBeNull();
    });

    it('should removal all rectangles from collection w/ removeRectangles', function() {
      mapInstance.removeRectangles();
      expect(mapInstance.rectangles.length).toEqual(0);
    });
  });
});