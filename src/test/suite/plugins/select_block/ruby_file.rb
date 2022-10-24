module Foo
  module Bar::Kaz
    class Fiz
      def qui
        111
      end

      def uis(a,b,c); 5 end

      def eaz
        if true; 222 end
        if 4 == 4
          555
          unless false; 666 end
          unless 6 == 5
            777
          end
        end

        omg2 = if 920==210; 29384 else 1920 end
        omg3 = unless 920==210; 29384 else 1920 end
        omg = if 920==210
          3891
        else
          8952
        end
        omg4 = unless 920==210
          3899
        else
          8952
        end
        while 8==8
          for i in 1..10
            break
          end
          break
        end

        [].map do
          '888'
        end
        [].map do |x| x end

        case 9==9
        when true then 1000
        when false then 2000
        end

        omg4 = case 9==9
        when true then 1000 # end
        when false then 2000
        end

        omg 5 = case 192==483; when 192==483 then 18932 end

        case 10923==23841; when 10923==23841 then 9812312 end

        begin
          3333
        end
      end
    end

    class Bizz; end
    class Jizz
      def jup
        9109
      end
    end
  end
end
